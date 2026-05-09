import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { FarmerOutstandingDetail, UnpaidSale, LedgerEntry } from '@models/collection.model';
import { PaginatedResponse } from '@models/pagination.model';
import { CollectionNoteAddComponent } from '../collection-note-add/collection-note-add.component';

const MOCK_UNPAID_SALES: UnpaidSale[] = [
  { saleRef: 'SAL-2026-0812', date: '22 Mar 2026', total: 12000, paid: 5000, outstanding: 7000, ageDays: 47 },
  { saleRef: 'SAL-2026-0744', date: '10 Mar 2026', total: 8500, paid: 0, outstanding: 8500, ageDays: 59 },
  { saleRef: 'SAL-2026-0631', date: '15 Feb 2026', total: 5000, paid: 2000, outstanding: 3000, ageDays: 82 },
];

const MOCK_PAYMENTS: LedgerEntry[] = [
  { date: '12 Mar 2026', description: 'Payment received (cash)', amount: 5000, type: 'payment' },
  { date: '1 Feb 2026', description: 'Payment received (NEFT)', amount: 3000, type: 'payment' },
  { date: '5 Jan 2026', description: 'Payment received (cash)', amount: 10000, type: 'payment' },
];

const MOCK_FARMER: FarmerOutstandingDetail = {
  farmerId: 'f001',
  farmerName: 'Ramesh Kumar',
  farmerCode: 'FARM-DEL-0042',
  village: 'Sultanpur, Dehradun',
  totalOutstanding: 18500,
  oldestDueDays: 47,
  lastPaymentAmount: 5000,
  lastPaymentDate: '12 Mar 2026',
  lastContactNote: 'Said will pay after wheat harvest',
  lastContactDate: '10 Apr 2026',
  lastContactBy: 'Raj Kumar',
  harvestMonth: 'May 2026',
  priorityScore: 37000,
  ageFactor: 1.5,
  harvestFactor: 2.0,
  unpaidSales: MOCK_UNPAID_SALES,
  recentPayments: MOCK_PAYMENTS,
  activityNotes: [
    { id: 'n1', text: 'Said will pay after wheat harvest', createdBy: 'Raj Kumar', createdAt: '10 Apr 2026', hasTodo: true, todoDate: '16 May 2026' },
    { id: 'n2', text: 'Called twice, no answer. Will try again tomorrow.', createdBy: 'Priya Singh', createdAt: '2 Apr 2026', hasTodo: false, todoDate: null },
    { id: 'n3', text: 'Met in person at mandi. Confirmed outstanding ₹18,500. He is waiting for wheat price to settle.', createdBy: 'Raj Kumar', createdAt: '20 Mar 2026', hasTodo: false, todoDate: null },
  ],
};

function toPaginatedResponse<T>(items: T[]): PaginatedResponse<T> {
  return { items, totalCount: items.length, pageNumber: 1, pageSize: items.length, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
}

@Component({
  selector: 'app-collection-farmer-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, KlCardComponent, KlGridComponent, CollectionNoteAddComponent],
  templateUrl: './collection-farmer-detail.component.html',
  styleUrl: './collection-farmer-detail.component.scss',
})
export class CollectionFarmerDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly farmer = signal<FarmerOutstandingDetail>(MOCK_FARMER);
  readonly activeTab = signal<'unpaid' | 'payments' | 'activity'>('unpaid');
  readonly noteDrawerOpen = signal(false);

  readonly unpaidSalesData = computed(() => toPaginatedResponse(this.farmer().unpaidSales));
  readonly paymentsData = computed(() => toPaginatedResponse(this.farmer().recentPayments));

  readonly unpaidSalesColumns: GridColumn[] = [
    { field: 'saleRef', header: 'Sale Ref', sortable: false },
    { field: 'date', header: 'Date', sortable: false },
    { field: 'total', header: 'Total (₹)', sortable: false, displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}` },
    { field: 'paid', header: 'Paid (₹)', sortable: false, displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}` },
    { field: 'outstanding', header: 'Outstanding (₹)', sortable: false, displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}` },
    { field: 'ageDays', header: 'Age', sortable: false, displayValue: (v) => `${v} days` },
  ];

  readonly paymentsColumns: GridColumn[] = [
    { field: 'date', header: 'Date', sortable: false },
    { field: 'description', header: 'Description', sortable: false },
    { field: 'amount', header: 'Amount (₹)', sortable: false, displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}` },
  ];

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }
}
