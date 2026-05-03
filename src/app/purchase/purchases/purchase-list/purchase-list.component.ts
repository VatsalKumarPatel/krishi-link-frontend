import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { PurchaseAddComponent } from '../purchase-add/purchase-add.component';
import { PurchaseService } from '@services/purchase.service';
import { UserService } from '@services/user.service';
import {
  PurchaseSummaryDto,
  PurchaseStatus,
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_BADGE,
} from '@models/purchase.model';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';

type ListTab = 'all' | 'pending' | 'overdue';
type PurchaseRow = PurchaseSummaryDto & {
  statusLabel: string;
  overdueLabel: string;
  totalAmountFmt: string;
  outstandingFmt: string;
};

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent, PurchaseAddComponent],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
})
export class PurchaseListComponent {
  private readonly purchaseService = inject(PurchaseService);
  readonly userService = inject(UserService);
  private readonly router = inject(Router);

  activeTab = signal<ListTab>('all');
  statusFilter = signal<number | undefined>(undefined);
  supplierIdFilter = signal<string | undefined>(
    inject(ActivatedRoute).snapshot.queryParamMap.get('supplierId') ?? undefined
  );
  fromDate = signal('');
  toDate = signal('');
  pageIndex = signal(0);
  pageSize = signal(20);
  drawerOpen = signal(false);
  purchaseIdForEdit = signal<string | null>(null);

  readonly statusOptions = [
    { value: undefined, label: 'All Statuses' },
    { value: PurchaseStatus.Draft, label: 'Draft' },
    { value: PurchaseStatus.Received, label: 'Received' },
    { value: PurchaseStatus.Invoiced, label: 'Invoiced' },
    { value: PurchaseStatus.PartiallyPaid, label: 'Partially Paid' },
    { value: PurchaseStatus.Paid, label: 'Paid' },
    { value: PurchaseStatus.Cancelled, label: 'Cancelled' },
  ];

  readonly columns: GridColumn[] = [
    { field: 'purchaseRef', header: 'Purchase Ref', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'storeName', header: 'Store', sortable: false },
    { field: 'purchaseDate', header: 'Date', type: 'date', sortable: false },
    { field: 'dueDate', header: 'Due Date', type: 'date', sortable: false },
    { field: 'totalAmountFmt', header: 'Total (₹)', sortable: false },
    { field: 'outstandingFmt', header: 'Outstanding (₹)', sortable: false },
    { field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v, row: PurchaseRow) => PURCHASE_STATUS_BADGE[row.status] },
    { field: 'overdueLabel', header: '', type: 'badge', sortable: false,
      badgeVariant: () => 'danger' },
  ];

  private readonly queryParams = computed(() => ({
    tab: this.activeTab(),
    status: this.statusFilter(),
    supplierId: this.supplierIdFilter(),
    fromDate: this.fromDate(),
    toDate: this.toDate(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
  }));

  purchasesResource = rxResource<PaginatedResponse<PurchaseRow>, ReturnType<PurchaseListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) => {
      const req = params.tab === 'pending'
        ? this.purchaseService.getPendingPayment(params.pageIndex + 1, params.pageSize)
        : params.tab === 'overdue'
          ? this.purchaseService.getOverdue(params.pageIndex + 1, params.pageSize)
          : this.purchaseService.getAll({
              supplierId: params.supplierId,
              status: params.status,
              fromDate: params.fromDate || undefined,
              toDate: params.toDate || undefined,
              page: params.pageIndex + 1,
              pageSize: params.pageSize,
            });

      return req.pipe(
        map(r => ({
          items: r.items.map(p => ({
            ...p,
            statusLabel: PURCHASE_STATUS_LABELS[p.status],
            overdueLabel: this.isOverdue(p) ? 'Overdue' : '',
            totalAmountFmt: `₹${fmt(p.totalAmount)}`,
            outstandingFmt: p.outstandingAmount > 0 ? `₹${fmt(p.outstandingAmount)}` : '—',
          })),
          totalCount: r.totalCount,
          pageNumber: r.page,
          pageSize: r.pageSize,
          totalPages: r.totalPages,
          hasPreviousPage: r.hasPreviousPage,
          hasNextPage: r.hasNextPage,
        }))
      );
    },
  });

  purchases = computed(() => this.purchasesResource.value() ?? createEmptyPaginatedResponse<PurchaseRow>());

  setTab(tab: ListTab): void {
    this.activeTab.set(tab);
    this.pageIndex.set(0);
  }

  setStatus(val: string): void {
    this.statusFilter.set(val ? +val : undefined);
    this.pageIndex.set(0);
  }

  setFromDate(val: string): void { this.fromDate.set(val); this.pageIndex.set(0); }
  setToDate(val: string): void { this.toDate.set(val); this.pageIndex.set(0); }

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  onRowClick(row: PurchaseRow): void {
    this.router.navigate(['/purchase/purchases', row.id]);
  }

  openAdd(): void {
    this.purchaseIdForEdit.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(row: PurchaseRow): void {
    this.purchaseIdForEdit.set(row.id);
    this.drawerOpen.set(true);
  }

  onDrawerSaved(): void {
    this.drawerOpen.set(false);
    this.purchasesResource.reload();
  }

  private isOverdue(p: PurchaseSummaryDto): boolean {
    if (!p.dueDate) return false;
    const s = p.status as number;
    return (s === PurchaseStatus.Invoiced || s === PurchaseStatus.PartiallyPaid)
      && new Date(p.dueDate) < new Date();
  }
}
