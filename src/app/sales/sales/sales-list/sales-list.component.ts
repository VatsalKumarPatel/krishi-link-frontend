import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { PagedListBase } from '@app/utils/paged-list-base';
import { PaginatedResponse } from '@models/pagination.model';
import { SaleSummaryRow, SaleStatus, SalePaymentMode, SALE_STATUS_BADGE, SALE_STATUS_LABELS } from '@models/sale.model';

type ListTab = 'all' | 'draft' | 'invoiced' | 'overdue';

const MOCK_SALES: SaleSummaryRow[] = [
  { id: 's001', saleRef: 'SALE-DEL-2026-00143', farmerName: 'Ramesh Kumar',    farmerCode: 'FARM-DEL-0042', saleDate: '8 May 2026',  paymentMode: 'Credit', status: 'PartiallyPaid', totalAmount: 24500, outstandingAmount: 12500 },
  { id: 's002', saleRef: 'SALE-DEL-2026-00142', farmerName: 'Sunita Poudel',   farmerCode: 'FARM-DEL-0031', saleDate: '7 May 2026',  paymentMode: 'Cash',   status: 'Paid',          totalAmount: 8200,  outstandingAmount: 0 },
  { id: 's003', saleRef: 'SALE-DEL-2026-00141', farmerName: 'Arjun Rai',       farmerCode: 'FARM-DEL-0055', saleDate: '6 May 2026',  paymentMode: 'UPI',    status: 'Paid',          totalAmount: 3600,  outstandingAmount: 0 },
  { id: 's004', saleRef: 'SALE-DEL-2026-00140', farmerName: 'Maya Gurung',     farmerCode: 'FARM-DEL-0018', saleDate: '5 May 2026',  paymentMode: 'Credit', status: 'Invoiced',      totalAmount: 41000, outstandingAmount: 41000 },
  { id: 's005', saleRef: 'SALE-DEL-2026-00139', farmerName: 'Raju Thapa',      farmerCode: 'FARM-DEL-0072', saleDate: '5 May 2026',  paymentMode: 'Credit', status: 'Invoiced',      totalAmount: 18500, outstandingAmount: 18500 },
  { id: 's006', saleRef: 'SALE-DEL-2026-00138', farmerName: 'Priya Sharma',    farmerCode: 'FARM-DEL-0089', saleDate: '4 May 2026',  paymentMode: 'Cash',   status: 'Draft',         totalAmount: 6700,  outstandingAmount: 6700 },
  { id: 's007', saleRef: 'SALE-DEL-2026-00137', farmerName: 'Govind Prasad',   farmerCode: 'FARM-DEL-0011', saleDate: '3 May 2026',  paymentMode: 'Credit', status: 'Paid',          totalAmount: 32400, outstandingAmount: 0 },
  { id: 's008', saleRef: 'SALE-DEL-2026-00136', farmerName: 'Rekha Devi',      farmerCode: 'FARM-DEL-0067', saleDate: '2 May 2026',  paymentMode: 'Credit', status: 'PartiallyPaid', totalAmount: 15800, outstandingAmount: 8800 },
  { id: 's009', saleRef: 'SALE-DEL-2026-00135', farmerName: 'Mohan Singh',     farmerCode: 'FARM-DEL-0044', saleDate: '1 May 2026',  paymentMode: 'Credit', status: 'Invoiced',      totalAmount: 9200,  outstandingAmount: 9200 },
  { id: 's010', saleRef: 'SALE-DEL-2026-00134', farmerName: 'Kamla Verma',     farmerCode: 'FARM-DEL-0093', saleDate: '30 Apr 2026', paymentMode: 'Cash',   status: 'Cancelled',     totalAmount: 4500,  outstandingAmount: 0 },
];

function toPaginatedResponse<T>(items: T[]): PaginatedResponse<T> {
  return { items, totalCount: items.length, pageNumber: 1, pageSize: items.length, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
}

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
})
export class SalesListComponent extends PagedListBase {
  private readonly router = inject(Router);

  readonly activeTab = signal<ListTab>('all');
  readonly statusFilter = signal<SaleStatus | ''>('');
  readonly modeFilter = signal<SalePaymentMode | ''>('');

  readonly salesData = computed<PaginatedResponse<SaleSummaryRow>>(() => {
    const tab = this.activeTab();
    const q = this.query().toLowerCase();
    let items = MOCK_SALES;
    if (tab === 'draft') items = items.filter(s => s.status === 'Draft');
    else if (tab === 'invoiced') items = items.filter(s => s.status === 'Invoiced' || s.status === 'PartiallyPaid');
    else if (tab === 'overdue') items = items.filter(s => s.outstandingAmount > 0 && s.status !== 'Paid' && s.status !== 'Cancelled');
    if (q) items = items.filter(s => s.saleRef.toLowerCase().includes(q) || s.farmerName.toLowerCase().includes(q) || s.farmerCode.toLowerCase().includes(q));
    const m = this.modeFilter();
    if (m) items = items.filter(s => s.paymentMode === m);
    return toPaginatedResponse(items);
  });

  readonly totalOutstanding = computed(() => MOCK_SALES.filter(s => s.outstandingAmount > 0).reduce((t, s) => t + s.outstandingAmount, 0));

  readonly columns: GridColumn[] = [
    { field: 'saleRef',          header: 'Sale Ref',        sortable: false },
    { field: 'farmerName',       header: 'Farmer',          sortable: false, displayValue: (_, row: SaleSummaryRow) => `${row.farmerName} · ${row.farmerCode}` },
    { field: 'saleDate',         header: 'Date',            sortable: false },
    { field: 'paymentMode',      header: 'Mode',            sortable: false },
    { field: 'totalAmount',      header: 'Total (₹)',       sortable: false, displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}` },
    { field: 'outstandingAmount',header: 'Outstanding (₹)', sortable: false, displayValue: (v) => (v as number) > 0 ? `₹${(v as number).toLocaleString('en-IN')}` : '—' },
    { field: 'status',           header: 'Status',          sortable: false, type: 'badge', badgeVariant: (_, row: SaleSummaryRow) => SALE_STATUS_BADGE[row.status] as any, displayValue: (v) => SALE_STATUS_LABELS[v as SaleStatus] },
  ];

  setActiveTab(tab: ListTab): void {
    this.activeTab.set(tab);
    this.pageIndex.set(0);
  }

  onRowClick(row: SaleSummaryRow): void {
    this.router.navigate(['/sales', row.id]);
  }

  fmtInr(n: number): string { return `₹${n.toLocaleString('en-IN')}`; }
}
