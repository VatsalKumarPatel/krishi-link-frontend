import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { CollectionTarget } from '@models/collection.model';
import { PaginatedResponse } from '@models/pagination.model';
import { CollectionTargetAddComponent } from '../collection-target-add/collection-target-add.component';

const MOCK_DAILY: CollectionTarget = {
  id: 't1', targetType: 'Daily', targetAmount: 80000, amountCollected: 45000,
  periodStart: '2026-05-08', periodEnd: '2026-05-08', isActive: true,
};

const MOCK_WEEKLY: CollectionTarget = {
  id: 't2', targetType: 'Weekly', targetAmount: 300000, amountCollected: 120000,
  periodStart: '2026-05-05', periodEnd: '2026-05-11', isActive: true,
};

interface RecentPayment { date: string; farmerName: string; farmerCode: string; amount: number; method: string; }

const MOCK_RECENT: RecentPayment[] = [
  { date: '8 May 2026', farmerName: 'Ramesh Kumar', farmerCode: 'FARM-DEL-0042', amount: 10000, method: 'Cash' },
  { date: '7 May 2026', farmerName: 'Priya Devi', farmerCode: 'FARM-DEL-0055', amount: 5000, method: 'NEFT' },
  { date: '7 May 2026', farmerName: 'Geeta Kumari', farmerCode: 'FARM-DEL-0033', amount: 8000, method: 'Cash' },
  { date: '6 May 2026', farmerName: 'Anjali Verma', farmerCode: 'FARM-DEL-0011', amount: 12000, method: 'UPI' },
  { date: '5 May 2026', farmerName: 'Santosh Mishra', farmerCode: 'FARM-DEL-0078', amount: 10000, method: 'Cash' },
];

function pct(collected: number, target: number): number {
  return Math.min(Math.round((collected / target) * 100), 100);
}

function toPaginatedResponse<T>(items: T[]): PaginatedResponse<T> {
  return { items, totalCount: items.length, pageNumber: 1, pageSize: items.length, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
}

@Component({
  selector: 'app-collection-targets',
  standalone: true,
  imports: [RouterLink, DecimalPipe, KlCardComponent, KlGridComponent, CollectionTargetAddComponent],
  templateUrl: './collection-targets.component.html',
  styleUrl: './collection-targets.component.scss',
})
export class CollectionTargetsComponent {
  readonly drawerOpen = signal(false);
  readonly daily = signal<CollectionTarget | null>(MOCK_DAILY);
  readonly weekly = signal<CollectionTarget | null>(MOCK_WEEKLY);
  readonly recentPaymentsData = toPaginatedResponse(MOCK_RECENT);

  readonly recentColumns: GridColumn[] = [
    { field: 'date', header: 'Date', sortable: false },
    { field: 'farmerName', header: 'Farmer', sortable: false, displayValue: (v, row) => `${v} · ${row['farmerCode']}` },
    { field: 'amount', header: 'Amount (₹)', sortable: false, displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}` },
    { field: 'method', header: 'Method', sortable: false },
  ];

  pct = pct;

  daysRemaining(target: CollectionTarget): number {
    const end = new Date(target.periodEnd);
    const today = new Date('2026-05-08');
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }
}
