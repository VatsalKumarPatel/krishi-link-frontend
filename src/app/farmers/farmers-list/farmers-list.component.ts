import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { PagedListBase } from '@app/utils/paged-list-base';
import { FarmerDto } from '@app/models/farmer.model';
import { MOCK_FARMERS } from '../farmers.data';
import { FarmerAddComponent } from '../farmer-add/farmer-add.component';
import { PaginatedResponse } from '@app/models/pagination.model';

type StatusTab = 'all' | 'active' | 'inactive';

interface FarmerRow extends FarmerDto {
  fullName: string;
  statusLabel: string;
  completenessLabel: string;
  creditLabel: string;
}

@Component({
  selector: 'app-farmers-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, FarmerAddComponent],
  templateUrl: './farmers-list.component.html',
  styleUrl: './farmers-list.component.scss',
})
export class FarmersListComponent extends PagedListBase {
  private readonly router = inject(Router);
  readonly statusTab = signal<StatusTab>('all');

  readonly columns: GridColumn[] = [
    { field: 'fullName',           header: 'Farmer',            sortable: true },
    { field: 'farmerCode',         header: 'Code',              sortable: false },
    { field: 'mobileNumber',       header: 'Mobile',            sortable: false, displayValue: (v: string) => v ?? '—' },
    { field: 'village',            header: 'Village',           sortable: true,  displayValue: (v: string) => v ?? '—' },
    { field: 'district',           header: 'District',          sortable: true,  displayValue: (v: string) => v ?? '—' },
    { field: 'creditLabel',        header: 'Outstanding',       sortable: false },
    { field: 'completenessLabel',  header: 'Profile',           sortable: false },
    {
      field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: FarmerRow): BadgeVariant => row.isActive ? 'success' : 'neutral',
    },
  ];

  private readonly allRows = computed<FarmerRow[]>(() =>
    MOCK_FARMERS.map(f => ({
      ...f,
      fullName: [f.firstName, f.lastName].filter(Boolean).join(' '),
      statusLabel: f.isActive ? 'Active' : 'Inactive',
      completenessLabel: `${f.profileCompleteness}%`,
      creditLabel: f.currentOutstanding > 0 ? `₹${f.currentOutstanding.toLocaleString('en-IN')}` : '—',
    }))
  );

  readonly filteredData = computed<PaginatedResponse<FarmerRow>>(() => {
    const tab = this.statusTab();
    const q = this.query().toLowerCase();
    let items = this.allRows();
    if (tab === 'active') items = items.filter(f => f.isActive);
    else if (tab === 'inactive') items = items.filter(f => !f.isActive);
    if (q) items = items.filter(f =>
      f.fullName.toLowerCase().includes(q) ||
      f.farmerCode.toLowerCase().includes(q) ||
      (f.mobileNumber ?? '').includes(q) ||
      (f.village ?? '').toLowerCase().includes(q) ||
      (f.district ?? '').toLowerCase().includes(q)
    );
    const start = this.pageIndex() * this.pageSize();
    const ps = this.pageSize(); const total = items.length;
    const totalPages = Math.ceil(total / ps) || 1; const page = this.pageIndex() + 1;
    return { items: items.slice(start, start + ps), totalCount: total, pageNumber: page, pageSize: ps, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
  });

  readonly activeCount = computed(() => MOCK_FARMERS.filter(f => f.isActive).length);
  readonly inactiveCount = computed(() => MOCK_FARMERS.filter(f => !f.isActive).length);

  setTab(t: StatusTab): void { this.filterSet(this.statusTab, t); }

  onRowClick(row: FarmerRow): void {
    this.router.navigate(['/farmers', row.id]);
  }
}
