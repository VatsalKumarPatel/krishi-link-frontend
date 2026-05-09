import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { StoreAddComponent } from '../store-add/store-add.component';
import { StoreService } from '@services/store.service';
import { StoreDto, StoreListFilters } from '@models/store.model';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { createEmptyPaginatedResponse, PaginatedResponse } from '@app/models/pagination.model';
import { PagedListBase } from '@app/utils/paged-list-base';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [KlCardComponent, StoreAddComponent, KlGridComponent],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss',
})
export class StoresListComponent extends PagedListBase {
  tenantId = input<string | null>(null);
  embedded = input(false);

  private readonly storeService = inject(StoreService);
  private readonly router = inject(Router);

  editStore = computed(() => {
    const id = this.editId();
    return this.storesResource.value()?.items.find(s => s.id === id) ?? null;
  });

  private readonly allColumns: GridColumn[] = [
    { field: 'name', header: 'Store' },
    { field: 'tenantName', header: 'Tenant' },
    { field: 'city', header: 'City' },
    { field: 'gstin', header: 'GSTIN', sortable: false },
    { field: 'phone', header: 'Phone', sortable: false },
    { field: 'isActive', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: StoreDto) => row.isActive ? 'success' : 'neutral',
      displayValue: (v: boolean) => v ? 'Active' : 'Inactive' },
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
    sortCol: this.sortCol(),
    sortDir: this.sortDir(),
    tenantId: this.tenantId(),
  }));

  storesResource = rxResource<PaginatedResponse<StoreDto>, ReturnType<StoresListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) => {
      const filters: StoreListFilters = {
        search: params.query || undefined,
        tenantId: params.tenantId ?? undefined,
        sortBy: params.sortCol || undefined,
        sortDir: params.sortDir,
      };
      return this.storeService.getAll(params.pageIndex + 1, params.pageSize, filters);
    },
  });

  stores = computed(() => this.storesResource.value() ?? createEmptyPaginatedResponse<StoreDto>());

  onRowClick(store: StoreDto): void {
    this.router.navigate(['/admin/stores', store.id]);
  }

  openEditStore(s: StoreDto): void {
    this.editId.set(s.id);
    this.drawerOpen.set(true);
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.storesResource.reload();
  }
}
