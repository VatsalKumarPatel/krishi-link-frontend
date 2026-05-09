import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { PagedListBase } from '@app/utils/paged-list-base';
import { StockAdjustmentDto, AdjustmentType, AdjustmentStatus } from '@app/models/inventory.model';
import { MOCK_ADJUSTMENTS } from '../../inventory.data';
import { AdjustmentAddComponent } from '../adjustment-add/adjustment-add.component';
import { PaginatedResponse } from '@app/models/pagination.model';

interface AdjRow extends StockAdjustmentDto { typeFmt: string; diffFmt: string; }

@Component({
  selector: 'app-adjustment-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent, AdjustmentAddComponent],
  templateUrl: './adjustment-list.component.html',
  styleUrl: './adjustment-list.component.scss',
})
export class AdjustmentListComponent extends PagedListBase {
  readonly typeFilter = signal<AdjustmentType | undefined>(undefined);
  readonly statusFilter = signal<AdjustmentStatus | undefined>(undefined);

  readonly columns: GridColumn[] = [
    { field: 'id',          header: 'ID',         sortable: false, displayValue: v => v.replace('adj-', '#') },
    { field: 'productName', header: 'Product',    sortable: true },
    { field: 'storeName',   header: 'Store',      sortable: true },
    {
      field: 'typeFmt', header: 'Type', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: AdjRow): BadgeVariant => {
        if (row.adjustmentType === 'Damage') return 'danger';
        if (row.adjustmentType === 'PhysicalCount') return 'neutral';
        return 'info';
      },
    },
    { field: 'diffFmt',     header: 'Difference', sortable: false },
    {
      field: 'status', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (v: string): BadgeVariant => {
        if (v === 'Approved') return 'success';
        if (v === 'PendingApproval') return 'warning';
        if (v === 'Rejected') return 'danger';
        return 'neutral';
      },
    },
    { field: 'createdBy',   header: 'Created by', sortable: false },
    { field: 'createdAt',   header: 'Date',        type: 'date', sortable: true, dateFormat: 'dd MMM yyyy' },
  ];

  private readonly allRows = computed<AdjRow[]>(() =>
    MOCK_ADJUSTMENTS.map(a => ({
      ...a,
      typeFmt: a.adjustmentType === 'ManualCorrection' ? 'Manual' : a.adjustmentType === 'PhysicalCount' ? 'Physical Count' : 'Damage',
      diffFmt: `${a.differenceQty > 0 ? '+' : ''}${a.differenceQty} ${a.unit}`,
    }))
  );

  readonly filteredData = computed<PaginatedResponse<AdjRow>>(() => {
    const q = this.query().toLowerCase();
    const type = this.typeFilter();
    const status = this.statusFilter();
    let items = this.allRows();
    if (type)   items = items.filter(a => a.adjustmentType === type);
    if (status) items = items.filter(a => a.status === status);
    if (q)      items = items.filter(a => a.productName.toLowerCase().includes(q) || a.storeName.toLowerCase().includes(q));
    const start = this.pageIndex() * this.pageSize();
    const ps = this.pageSize(); const total = items.length;
    const totalPages = Math.ceil(total / ps) || 1; const page = this.pageIndex() + 1;
    return { items: items.slice(start, start + ps), totalCount: total, pageNumber: page, pageSize: ps, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
  });

  readonly pendingCount = computed(() => MOCK_ADJUSTMENTS.filter(a => a.status === 'PendingApproval').length);

  setType(t: AdjustmentType | undefined): void { this.filterSet(this.typeFilter, t); }
  setStatus(s: AdjustmentStatus | undefined): void { this.filterSet(this.statusFilter, s); }

  onRowClick(row: AdjRow): void { /* navigate to detail if needed */ }

  closeDrawer(): void { this.drawerOpen.set(false); }
}
