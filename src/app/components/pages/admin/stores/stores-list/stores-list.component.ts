import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '../../../../shared/kl-card/kl-card.component';
import { StoreAddComponent } from '../store-add/store-add.component';
import { StoreService } from '@services/store.service';
import { StoreDto, StoreListFilters } from '@models/store.model';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { createEmptyPaginatedResponse, PaginatedResponse } from '@app/models/pagination.model';

type StoreRow = StoreDto & { status: string };

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [KlCardComponent, StoreAddComponent, KlGridComponent],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss',
})
export class StoresListComponent {
  tenantId = input<string | null>(null);
  embedded = input(false);

  private readonly storeService = inject(StoreService);
  private readonly router = inject(Router);

  query = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);
  sorting = signal('name');

  drawerOpen = signal(false);
  editStore = signal<StoreDto | null>(null);

  private readonly allColumns: GridColumn[] = [
    { field: 'name', header: 'Store' },
    { field: 'tenantName', header: 'Tenant' },
    { field: 'city', header: 'City' },
    { field: 'gstin', header: 'GSTIN', sortable: false },
    { field: 'phone', header: 'Phone', sortable: false },
    { field: 'status', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: StoreRow) => row.isActive ? 'success' : 'neutral' },
  ];

  columns = computed(() =>
    this.embedded()
      ? this.allColumns.filter(c => c.field !== 'tenantName')
      : this.allColumns
  );

  private readonly queryParams = computed(() => ({
    query: this.query(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    sort: this.sorting(),
    tenantId: this.tenantId(),
  }));

  storesResource = rxResource<PaginatedResponse<StoreRow>, ReturnType<StoresListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) => {
      const sortField = params.sort.startsWith('-') ? params.sort.slice(1) : params.sort;
      const sortDir = params.sort.startsWith('-') ? 'desc' : 'asc';
      const filters: StoreListFilters = {
        search: params.query || undefined,
        tenantId: params.tenantId ?? undefined,
        sortBy: sortField,
        sortDir,
      };
      return this.storeService.getAll(params.pageIndex + 1, params.pageSize, filters).pipe(
        map(result => ({
          items: result.items.map(s => ({ ...s, status: s.isActive ? 'Active' : 'Inactive' })),
          totalCount: result.totalCount,
          pageNumber: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
          hasPreviousPage: result.hasPreviousPage,
          hasNextPage: result.hasNextPage,
        }))
      );
    },
  });

  stores = computed(() => this.storesResource.value() ?? createEmptyPaginatedResponse<StoreRow>());

  onSearch(value: string): void {
    this.query.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: string): void {
    this.sorting.set(sort);
    this.pageIndex.set(0);
  }

  onRowClick(store: StoreRow): void {
    this.router.navigate(['/admin/stores', store.id]);
  }

  openAdd(): void {
    this.editStore.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(s: StoreRow): void {
    this.editStore.set(s);
    this.drawerOpen.set(true);
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.storesResource.reload();
  }
}
