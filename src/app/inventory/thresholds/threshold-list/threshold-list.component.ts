import { Component, computed, signal } from '@angular/core';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { PagedListBase } from '@app/utils/paged-list-base';
import { ProductStoreThresholdDto } from '@app/models/inventory.model';
import { MOCK_THRESHOLDS } from '../../inventory.data';
import { ThresholdAddComponent } from '../threshold-add/threshold-add.component';
import { PaginatedResponse } from '@app/models/pagination.model';

interface ThresholdRow extends ProductStoreThresholdDto { activeLabel: string; }

@Component({
  selector: 'app-threshold-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, ThresholdAddComponent],
  templateUrl: './threshold-list.component.html',
  styleUrl: './threshold-list.component.scss',
})
export class ThresholdListComponent extends PagedListBase {
  readonly columns: GridColumn[] = [
    { field: 'productName',           header: 'Product',            sortable: true },
    { field: 'storeName',             header: 'Store',              sortable: true },
    { field: 'reorderLevel',          header: 'Reorder Level',      sortable: true },
    { field: 'reorderQtyFmt',         header: 'Reorder Qty',        sortable: false },
    { field: 'preferredSupplierName', header: 'Preferred Supplier', sortable: false, displayValue: (v: string) => v ?? '—' },
    {
      field: 'activeLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: ThresholdRow): BadgeVariant => row.isActive ? 'success' : 'neutral',
    },
  ];

  private readonly allRows = computed<ThresholdRow[]>(() =>
    MOCK_THRESHOLDS.map(t => ({
      ...t,
      activeLabel: t.isActive ? 'Active' : 'Inactive',
      reorderQtyFmt: t.reorderQty != null ? String(t.reorderQty) : '—',
    }))
  );

  readonly filteredData = computed<PaginatedResponse<ThresholdRow>>(() => {
    const q = this.query().toLowerCase();
    let items = this.allRows();
    if (q) items = items.filter(t => t.productName.toLowerCase().includes(q) || t.storeName.toLowerCase().includes(q));
    const start = this.pageIndex() * this.pageSize();
    const ps = this.pageSize(); const total = items.length;
    const totalPages = Math.ceil(total / ps) || 1; const page = this.pageIndex() + 1;
    return { items: items.slice(start, start + ps), totalCount: total, pageNumber: page, pageSize: ps, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
  });

  closeDrawer(): void { this.drawerOpen.set(false); }
}
