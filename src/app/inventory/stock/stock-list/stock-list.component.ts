import { Component, computed, signal } from '@angular/core';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { PagedListBase } from '@app/utils/paged-list-base';
import { StockBalanceDto, StockStatus } from '@app/models/inventory.model';
import { MOCK_STOCK } from '../../inventory.data';
import { StockMovementsDrawerComponent } from '../stock-movements-drawer/stock-movements-drawer.component';
import { PaginatedResponse } from '@app/models/pagination.model';
import { RouterLink } from '@angular/router';

type StatusFilter = StockStatus | 'all';

interface StockRow extends StockBalanceDto {
  statusLabel: string;
}

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, StockMovementsDrawerComponent, RouterLink],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss',
})
export class StockListComponent extends PagedListBase {
  readonly storeFilter = signal<string | undefined>(undefined);
  readonly categoryFilter = signal<string | undefined>(undefined);
  readonly statusFilter = signal<StatusFilter>('all');
  readonly movementsProductId = signal<string | null>(null);
  readonly movementsOpen = signal(false);

  readonly stores = [...new Map(MOCK_STOCK.map(s => [s.storeId, s.storeName])).entries()].map(([id, name]) => ({ id, name }));
  readonly categories = [...new Set(MOCK_STOCK.map(s => s.category))];

  readonly columns: GridColumn[] = [
    { field: 'productName',  header: 'Product',       sortable: true },
    { field: 'sku',          header: 'SKU',            sortable: false },
    { field: 'category',     header: 'Category',       sortable: true },
    { field: 'storeName',    header: 'Store',          sortable: true },
    { field: 'availQtyFmt',  header: 'Available',      sortable: false },
    { field: 'reservedQtyFmt', header: 'Reserved',     sortable: false },
    { field: 'reorderFmt',   header: 'Reorder Level',  sortable: false },
    {
      field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: StockRow): BadgeVariant => {
        if (row.stockStatus === 'out') return 'danger';
        if (row.stockStatus === 'low') return 'warning';
        return 'success';
      },
    },
  ];

  private readonly allRows = computed<StockRow[]>(() =>
    MOCK_STOCK.map(s => ({
      ...s,
      statusLabel: s.stockStatus === 'out' ? 'Out of stock' : s.stockStatus === 'low' ? 'Low' : 'OK',
      availQtyFmt: `${s.availableQuantity} ${s.baseUnit}`,
      reservedQtyFmt: `${s.reservedQuantity} ${s.baseUnit}`,
      reorderFmt: s.reorderLevel != null ? `${s.reorderLevel} ${s.baseUnit}` : '—',
    }))
  );

  readonly filteredData = computed<PaginatedResponse<StockRow>>(() => {
    const q = this.query().toLowerCase();
    const store = this.storeFilter();
    const cat = this.categoryFilter();
    const status = this.statusFilter();

    let items = this.allRows();
    if (store)          items = items.filter(s => s.storeId === store);
    if (cat)            items = items.filter(s => s.category === cat);
    if (status !== 'all') items = items.filter(s => s.stockStatus === status);
    if (q)              items = items.filter(s => s.productName.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q));

    const start = this.pageIndex() * this.pageSize();
    const ps = this.pageSize(); const total = items.length;
    const totalPages = Math.ceil(total / ps) || 1; const page = this.pageIndex() + 1;
    return { items: items.slice(start, start + ps), totalCount: total, pageNumber: page, pageSize: ps, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
  });

  readonly lowStockCount = computed(() => MOCK_STOCK.filter(s => s.stockStatus !== 'ok').length);

  setStore(id: string | undefined): void { this.filterSet(this.storeFilter, id); }
  setCategory(c: string | undefined): void { this.filterSet(this.categoryFilter, c); }
  setStatus(s: StatusFilter): void { this.filterSet(this.statusFilter, s); }

  onRowClick(row: StockRow): void {
    this.movementsProductId.set(row.productId);
    this.movementsOpen.set(true);
  }

  closeMovements(): void { this.movementsOpen.set(false); }
}
