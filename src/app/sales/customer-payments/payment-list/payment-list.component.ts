import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { PaginatedResponse } from '@app/models/pagination.model';
import { PagedListBase } from '@app/utils/paged-list-base';
import {
  CustomerPaymentSummaryRow,
  CustomerPaymentMode,
  CustomerPaymentStatus,
  CUSTOMER_PAYMENT_STATUS_BADGE,
  CUSTOMER_PAYMENT_MODE_LABELS,
} from '@models/customer-payment.model';

const MOCK_PAYMENTS: CustomerPaymentSummaryRow[] = [
  { id: 'cp001', paymentRef: 'PMT-DEL-2026-00089', farmerName: 'Ramesh Kumar',  farmerCode: 'FARM-DEL-0042', mode: 'NEFT',   status: 'Verified',          amountReceived: 45000, unallocatedAmount: 8000,  paymentDate: '2026-04-10' },
  { id: 'cp002', paymentRef: 'PMT-DEL-2026-00078', farmerName: 'Sunita Poudel', farmerCode: 'FARM-DEL-0031', mode: 'Cash',   status: 'FullyAllocated',    amountReceived: 25000, unallocatedAmount: 0,     paymentDate: '2026-04-05' },
  { id: 'cp003', paymentRef: 'PMT-DEL-2026-00071', farmerName: 'Arjun Rai',     farmerCode: 'FARM-DEL-0055', mode: 'UPI',    status: 'PartiallyAllocated',amountReceived: 15000, unallocatedAmount: 5000,  paymentDate: '2026-03-28' },
  { id: 'cp004', paymentRef: 'PMT-DEL-2026-00065', farmerName: 'Maya Gurung',   farmerCode: 'FARM-DEL-0018', mode: 'Cheque', status: 'Recorded',          amountReceived: 30000, unallocatedAmount: 30000, paymentDate: '2026-03-22' },
  { id: 'cp005', paymentRef: 'PMT-DEL-2026-00060', farmerName: 'Raju Thapa',    farmerCode: 'FARM-DEL-0072', mode: 'Cash',   status: 'FullyAllocated',    amountReceived: 12000, unallocatedAmount: 0,     paymentDate: '2026-03-18' },
  { id: 'cp006', paymentRef: 'PMT-DEL-2026-00054', farmerName: 'Ramesh Kumar',  farmerCode: 'FARM-DEL-0042', mode: 'UPI',    status: 'Verified',          amountReceived: 20000, unallocatedAmount: 20000, paymentDate: '2026-03-12' },
  { id: 'cp007', paymentRef: 'PMT-DEL-2026-00048', farmerName: 'Sunita Poudel', farmerCode: 'FARM-DEL-0031', mode: 'Cheque', status: 'Reversed',          amountReceived: 8000,  unallocatedAmount: 0,     paymentDate: '2026-03-05' },
  { id: 'cp008', paymentRef: 'PMT-DEL-2026-00041', farmerName: 'Arjun Rai',     farmerCode: 'FARM-DEL-0055', mode: 'NEFT',   status: 'Verified',          amountReceived: 50000, unallocatedAmount: 0,     paymentDate: '2026-02-28' },
];

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
})
export class PaymentListComponent extends PagedListBase {
  private readonly router = inject(Router);

  readonly modeFilter = signal<CustomerPaymentMode | ''>('');
  readonly statusFilter = signal<CustomerPaymentStatus | ''>('');

  readonly modes: CustomerPaymentMode[] = ['Cash', 'UPI', 'Cheque', 'NEFT', 'IMPS', 'RTGS', 'DebitCard'];
  readonly statuses: CustomerPaymentStatus[] = ['Recorded', 'Verified', 'PartiallyAllocated', 'FullyAllocated', 'Reversed'];

  readonly columns: GridColumn[] = [
    { field: 'paymentRef',       header: 'Payment Ref',     sortable: false },
    { field: 'farmerName',       header: 'Farmer',          sortable: false, displayValue: (_, r) => `${r.farmerName} · ${r.farmerCode}` },
    { field: 'paymentDate',      header: 'Date',            sortable: false },
    { field: 'mode',             header: 'Mode',            sortable: false, displayValue: v => CUSTOMER_PAYMENT_MODE_LABELS[v as CustomerPaymentMode] },
    { field: 'amountReceived',   header: 'Amount (₹)',      sortable: false, displayValue: v => '₹' + (+v).toLocaleString('en-IN') },
    { field: 'unallocatedAmount',header: 'Unallocated (₹)', sortable: false, displayValue: v => +v > 0 ? '₹' + (+v).toLocaleString('en-IN') : '—' },
    { field: 'status',           header: 'Status',          sortable: false, type: 'badge', badgeVariant: (_, r) => CUSTOMER_PAYMENT_STATUS_BADGE[r.status as CustomerPaymentStatus] as any },
  ];

  readonly paymentsData = computed<PaginatedResponse<CustomerPaymentSummaryRow>>(() => {
    const q = this.query().toLowerCase();
    const mode = this.modeFilter();
    const status = this.statusFilter();

    let filtered = MOCK_PAYMENTS;
    if (mode)   filtered = filtered.filter(p => p.mode === mode);
    if (status) filtered = filtered.filter(p => p.status === status);
    if (q)      filtered = filtered.filter(p =>
      p.paymentRef.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      p.farmerCode.toLowerCase().includes(q)
    );

    const total = filtered.length;
    const pg = this.pageIndex();
    const ps = this.pageSize();
    const items = filtered.slice(pg * ps, pg * ps + ps);
    return { items, totalCount: total, pageNumber: pg + 1, pageSize: ps, totalPages: Math.ceil(total / ps) || 1, hasPreviousPage: pg > 0, hasNextPage: (pg + 1) * ps < total };
  });

  onRowClick(row: CustomerPaymentSummaryRow): void {
    this.router.navigate(['/sales/payments', row.id]);
  }
}
