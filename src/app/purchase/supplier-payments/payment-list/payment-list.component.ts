import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { PaymentAddComponent } from '../payment-add/payment-add.component';
import { SupplierPaymentService } from '@services/supplier-payment.service';
import {
  SupplierPaymentSummaryDto,
  PAYMENT_MODE_LABELS,
  SUPPLIER_PAYMENT_STATUS_LABELS,
} from '@models/supplier-payment.model';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';

type PaymentRow = SupplierPaymentSummaryDto & {
  modeLabel: string;
  statusLabel: string;
  amountFmt: string;
  unallocatedFmt: string;
};

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent, PaymentAddComponent],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent {
  private readonly paymentService = inject(SupplierPaymentService);
  private readonly router = inject(Router);

  supplierIdFilter = signal<string | undefined>(
    inject(ActivatedRoute).snapshot.queryParamMap.get('supplierId') ?? undefined
  );
  pageIndex = signal(0);
  pageSize = signal(20);
  drawerOpen = signal(false);
  paymentIdForEdit = signal<string | null>(null);

  readonly columns: GridColumn[] = [
    { field: 'paymentRef', header: 'Payment Ref', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'storeName', header: 'Store', sortable: false },
    { field: 'modeLabel', header: 'Mode', sortable: false },
    { field: 'paymentDate', header: 'Date', type: 'date', sortable: false },
    { field: 'amountFmt', header: 'Amount (₹)', sortable: false },
    { field: 'unallocatedFmt', header: 'Unallocated (₹)', sortable: false },
    { field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: () => 'info' },
  ];

  private readonly queryParams = computed(() => ({
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    supplierId: this.supplierIdFilter(),
  }));

  paymentsResource = rxResource<PaginatedResponse<PaymentRow>, ReturnType<PaymentListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) =>
      this.paymentService.getAll(params.pageIndex + 1, params.pageSize, params.supplierId).pipe(
        map(r => ({
          items: r.items.map(x => ({
            ...x,
            modeLabel: PAYMENT_MODE_LABELS[x.mode],
            statusLabel: SUPPLIER_PAYMENT_STATUS_LABELS[x.status],
            amountFmt: `₹${fmt(x.amountPaid)}`,
            unallocatedFmt: x.unallocatedAmount > 0 ? `₹${fmt(x.unallocatedAmount)}` : '—',
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

  payments = computed(() => this.paymentsResource.value() ?? createEmptyPaginatedResponse<PaymentRow>());

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  onRowClick(row: PaymentRow): void {
    this.router.navigate(['/purchase/supplier-payments', row.id]);
  }

  openAdd(): void {
    this.paymentIdForEdit.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(row: PaymentRow): void {
    this.paymentIdForEdit.set(row.id);
    this.drawerOpen.set(true);
  }

  onDrawerSaved(): void {
    this.drawerOpen.set(false);
    this.paymentsResource.reload();
  }
}
