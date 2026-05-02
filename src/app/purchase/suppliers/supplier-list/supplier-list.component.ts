import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { SupplierAddComponent } from '../supplier-add/supplier-add.component';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { SupplierSummaryDto } from '@models/supplier.model';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';

type SupplierRow = SupplierSummaryDto & {
  statusLabel: string;
  outstandingFmt: string;
  termsFmt: string;
};

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, SupplierAddComponent],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent {
  private readonly supplierService = inject(SupplierService);
  readonly userService = inject(UserService);
  private readonly router = inject(Router);

  query = signal('');
  pageIndex = signal(0);
  pageSize = signal(20);
  isActiveFilter = signal<boolean | undefined>(undefined);

  drawerOpen = signal(false);
  editSupplierId = signal<string | null>(null);

  confirmDeactivateId = signal<string | null>(null);
  deactivating = signal(false);

  readonly columns: GridColumn[] = [
    { field: 'name', header: 'Supplier' },
    { field: 'code', header: 'Code', sortable: false },
    { field: 'phoneNumber', header: 'Phone', sortable: false },
    { field: 'outstandingFmt', header: 'Outstanding (₹)', sortable: false },
    { field: 'termsFmt', header: 'Payment Terms', sortable: false },
    { field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v, row: SupplierRow) => row.isActive ? 'success' : 'neutral' },
  ];

  private readonly queryParams = computed(() => ({
    query: this.query(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    isActive: this.isActiveFilter(),
  }));

  suppliersResource = rxResource<PaginatedResponse<SupplierRow>, ReturnType<SupplierListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) =>
      this.supplierService.getAll(params.pageIndex + 1, params.pageSize, params.query || undefined, params.isActive).pipe(
        map(r => ({
          items: r.items.map(s => ({
            ...s,
            statusLabel: s.isActive ? 'Active' : 'Inactive',
            outstandingFmt: s.netOutstanding > 0 ? `₹${fmt(s.netOutstanding)}` : '₹0',
            termsFmt: s.paymentTermsDays > 0 ? `${s.paymentTermsDays} days` : '—',
          })),
          totalCount: r.totalCount,
          pageNumber: r.page,
          pageSize: r.pageSize,
          totalPages: r.totalPages,
          hasPreviousPage: r.hasPreviousPage,
          hasNextPage: r.hasNextPage,
        }))
      ),
  });

  suppliers = computed(() => this.suppliersResource.value() ?? createEmptyPaginatedResponse<SupplierRow>());

  onSearch(value: string): void {
    this.query.set(value);
    this.pageIndex.set(0);
  }

  setFilter(val: boolean | undefined): void {
    this.isActiveFilter.set(val);
    this.pageIndex.set(0);
  }

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  onSortChange(_sort: string): void {
    // supplier service doesn't support server-side sorting
  }

  onRowClick(row: SupplierRow): void {
    this.router.navigate(['/purchase/suppliers', row.id]);
  }

  isTenantAdmin(): boolean {
    return this.userService.profile()?.staffRole === 'TenantAdmin';
  }

  promptDeactivate(id: string): void { this.confirmDeactivateId.set(id); }
  cancelDeactivate(): void { this.confirmDeactivateId.set(null); }

  confirmDeactivate(): void {
    const id = this.confirmDeactivateId();
    if (!id) return;
    this.deactivating.set(true);
    this.supplierService.deactivate(id).subscribe({
      next: () => {
        this.confirmDeactivateId.set(null);
        this.deactivating.set(false);
        this.suppliersResource.reload();
      },
      error: () => this.deactivating.set(false),
    });
  }

  openAdd(): void {
    this.editSupplierId.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(row: SupplierRow): void {
    this.editSupplierId.set(row.id);
    this.drawerOpen.set(true);
  }

  onDrawerSaved(): void {
    this.drawerOpen.set(false);
    this.suppliersResource.reload();
  }
}
