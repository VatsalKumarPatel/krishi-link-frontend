import { Component, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { PaymentAddComponent } from '../payment-add/payment-add.component';
import { SupplierPaymentService } from '@services/supplier-payment.service';
import {
  SupplierPaymentSummaryDto,
  PAYMENT_MODE_LABELS,
  SUPPLIER_PAYMENT_STATUS_LABELS,
} from '@models/supplier-payment.model';
import { PaginatedResponse, createEmptyPaginatedResponse, toPagedResponse } from '@app/models/pagination.model';
import { formatMoneyWithSymbol } from '@app/utils/format';
import { PagedListBase } from '@app/utils/paged-list-base';

type PaymentRow = SupplierPaymentSummaryDto & {
  modeLabel: string;
  statusLabel: string;
  amountFmt: string;
  unallocatedFmt: string;
};

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, PaymentAddComponent],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent extends PagedListBase {
  private readonly paymentService = inject(SupplierPaymentService);
  private readonly router = inject(Router);

  supplierIdFilter = signal<string | undefined>(
    inject(ActivatedRoute).snapshot.queryParamMap.get('supplierId') ?? undefined
  );

  readonly columns: GridColumn[] = [
    { field: 'paymentRef', header: 'Payment Ref', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'storeName', header: 'Store', sortable: false },
    { field: 'modeLabel', header: 'Mode', sortable: false },
    { field: 'paymentDate', header: 'Date', type: 'date', sortable: false },
    { field: 'amountFmt', header: 'Amount (â‚¹)', sortable: false },
    { field: 'unallocatedFmt', header: 'Unallocated (â‚¹)', sortable: false },
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
        map(r => toPagedResponse(r, x => ({
          ...x,
          modeLabel: PAYMENT_MODE_LABELS[x.mode],
          statusLabel: SUPPLIER_PAYMENT_STATUS_LABELS[x.status],
          amountFmt: formatMoneyWithSymbol(x.amountPaid),
          unallocatedFmt: x.unallocatedAmount > 0 ? formatMoneyWithSymbol(x.unallocatedAmount) : 'â€“',
        })))
      ),
  });

  payments = computed(() => this.paymentsResource.value() ?? createEmptyPaginatedResponse<PaymentRow>());

  onRowClick(row: PaymentRow): void {
    this.router.navigate(['/purchase/supplier-payments', row.id]);
  }

  onDrawerSaved(): void {
    this.closeDrawerAndReload(this.paymentsResource);
  }
}
