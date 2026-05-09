import { Component, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { PagedListBase } from '@app/utils/paged-list-base';
import { CollectionQueueItem } from '@models/collection.model';
import { PaginatedResponse } from '@models/pagination.model';

const MOCK_QUEUE: CollectionQueueItem[] = [
  { rank: 1, farmerId: 'f001', farmerName: 'Ramesh Kumar', farmerCode: 'FARM-DEL-0042', outstanding: 18500, oldestDueDays: 47, lastContactDate: '10 Apr 2026', lastContactNote: 'Said will pay after wheat harvest', harvestMonth: 'May 2026', priorityScore: 37000 },
  { rank: 2, farmerId: 'f002', farmerName: 'Suresh Yadav', farmerCode: 'FARM-DEL-0018', outstanding: 32000, oldestDueDays: 68, lastContactDate: '2 Apr 2026', lastContactNote: 'Not reachable', harvestMonth: null, priorityScore: 64000 },
  { rank: 3, farmerId: 'f003', farmerName: 'Mohan Singh', farmerCode: 'FARM-DEL-0091', outstanding: 7500, oldestDueDays: 95, lastContactDate: null, lastContactNote: null, harvestMonth: 'Jun 2026', priorityScore: 22500 },
  { rank: 4, farmerId: 'f004', farmerName: 'Priya Devi', farmerCode: 'FARM-DEL-0055', outstanding: 12800, oldestDueDays: 22, lastContactDate: '1 May 2026', lastContactNote: 'Will settle next week', harvestMonth: 'May 2026', priorityScore: 19200 },
  { rank: 5, farmerId: 'f005', farmerName: 'Rajendra Prasad', farmerCode: 'FARM-DEL-0067', outstanding: 45000, oldestDueDays: 110, lastContactDate: '20 Mar 2026', lastContactNote: 'Disputed invoice amount', harvestMonth: null, priorityScore: 135000 },
  { rank: 6, farmerId: 'f006', farmerName: 'Geeta Kumari', farmerCode: 'FARM-DEL-0033', outstanding: 5200, oldestDueDays: 15, lastContactDate: '5 May 2026', lastContactNote: 'Confirmed payment this week', harvestMonth: 'May 2026', priorityScore: 7800 },
  { rank: 7, farmerId: 'f007', farmerName: 'Santosh Mishra', farmerCode: 'FARM-DEL-0078', outstanding: 28000, oldestDueDays: 80, lastContactDate: '15 Apr 2026', lastContactNote: 'Promised ₹15k by end of month', harvestMonth: 'Jun 2026', priorityScore: 56000 },
  { rank: 8, farmerId: 'f008', farmerName: 'Anjali Verma', farmerCode: 'FARM-DEL-0011', outstanding: 9600, oldestDueDays: 35, lastContactDate: null, lastContactNote: null, harvestMonth: null, priorityScore: 14400 },
  { rank: 9, farmerId: 'f009', farmerName: 'Deepak Tiwari', farmerCode: 'FARM-DEL-0099', outstanding: 21000, oldestDueDays: 58, lastContactDate: '28 Apr 2026', lastContactNote: 'Post-harvest payment expected', harvestMonth: 'Apr 2026', priorityScore: 42000 },
  { rank: 10, farmerId: 'f010', farmerName: 'Kavita Sharma', farmerCode: 'FARM-DEL-0044', outstanding: 3800, oldestDueDays: 12, lastContactDate: '7 May 2026', lastContactNote: 'Will pay today', harvestMonth: null, priorityScore: 3800 },
];

@Component({
  selector: 'app-collections-queue',
  standalone: true,
  imports: [FormsModule, DecimalPipe, KlCardComponent, KlGridComponent, RouterLink],
  templateUrl: './collections-queue.component.html',
  styleUrl: './collections-queue.component.scss',
})
export class CollectionsQueueComponent extends PagedListBase {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly outstandingFilter = signal('');
  readonly daysOverdueFilter = signal('');
  readonly harvestFilter = signal('');

  readonly queue = computed<PaginatedResponse<CollectionQueueItem>>(() => {
    let items = [...MOCK_QUEUE];

    const outstanding = this.outstandingFilter();
    if (outstanding === '0-5000') items = items.filter(i => i.outstanding <= 5000);
    else if (outstanding === '5000-25000') items = items.filter(i => i.outstanding > 5000 && i.outstanding <= 25000);
    else if (outstanding === '25000') items = items.filter(i => i.outstanding > 25000);

    const days = this.daysOverdueFilter();
    if (days === '30') items = items.filter(i => i.oldestDueDays >= 30);
    else if (days === '60') items = items.filter(i => i.oldestDueDays >= 60);
    else if (days === '90') items = items.filter(i => i.oldestDueDays >= 90);

    const harvest = this.harvestFilter();
    if (harvest) items = items.filter(i => i.harvestMonth === harvest);

    const q = this.query().toLowerCase();
    if (q) items = items.filter(i =>
      i.farmerName.toLowerCase().includes(q) || i.farmerCode.toLowerCase().includes(q),
    );

    return {
      items,
      totalCount: items.length,
      pageNumber: 1,
      pageSize: items.length,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  });

  readonly columns: GridColumn[] = [
    { field: 'rank', header: '#', sortable: false },
    {
      field: 'farmerName',
      header: 'Farmer',
      sortable: true,
      displayValue: (v, row) => `${v} · ${row['farmerCode']}`,
    },
    {
      field: 'outstanding',
      header: 'Outstanding (₹)',
      sortable: true,
      displayValue: (v) => `₹${(v as number).toLocaleString('en-IN')}`,
    },
    {
      field: 'oldestDueDays',
      header: 'Oldest Due',
      sortable: true,
      displayValue: (v) => `${v} days`,
    },
    {
      field: 'lastContactDate',
      header: 'Last Contact',
      sortable: false,
      displayValue: (v) => (v as string | null) ?? '—',
    },
    {
      field: 'harvestMonth',
      header: 'Harvest Month',
      sortable: false,
      displayValue: (v) => (v as string | null) ?? '—',
    },
    {
      field: 'priorityScore',
      header: 'Priority Score',
      sortable: true,
      displayValue: (v) => (v as number).toLocaleString('en-IN'),
    },
  ];

  readonly harvestMonths = ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'];

  readonly totalOutstanding = computed(() =>
    MOCK_QUEUE.reduce((s, i) => s + i.outstanding, 0),
  );

  readonly overdueCount = computed(() =>
    MOCK_QUEUE.filter(i => i.oldestDueDays >= 30).length,
  );

  onRowClick(item: CollectionQueueItem): void {
    this.router.navigate(['./', item.farmerId], { relativeTo: this.activatedRoute });
  }
}
