import { Component, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { TenantAddComponent } from '../tenant-add/tenant-add.component';
import { TenantService } from '@services/tenant.service';
import { TenantDto, TenantListFilters } from '@models/tenant.model';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { createEmptyPaginatedResponse, PaginatedResponse } from '@app/models/pagination.model';
import { PagedListBase } from '@app/utils/paged-list-base';

type TabStatus = 'All' | 'Active' | 'Inactive';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [KlCardComponent, TenantAddComponent, KlGridComponent],
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.scss',
})
export class TenantsListComponent extends PagedListBase {
  private readonly tenantService = inject(TenantService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  activeTab = signal<TabStatus>('All');

  editTenant = computed(() => {
    const id = this.editId();
    return this.tenantsResource.value()?.items.find(t => t.id === id) ?? null;
  });

  readonly columns: GridColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'addressLine1', header: 'Address' },
    {
      field: 'storeCount',
      header: 'Stores',
      type: 'badge',
      sortable: false,
      badgeVariant: (v: number) => (v > 0 ? 'info' : 'neutral'),
    },
    { field: 'city', header: 'City' },
    {
      field: 'subscriptionExpiresAt',
      header: 'Expires',
      type: 'date',
      dateFormat: 'd MMM yyyy',
    },
  ];

  private readonly queryParams = computed(() => ({
    query: this.query(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    sortCol: this.sortCol(),
    sortDir: this.sortDir(),
    activeTab: this.activeTab(),
  }));

  tenantsResource = rxResource<PaginatedResponse<TenantDto>, ReturnType<TenantsListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) => {
      const filters: TenantListFilters = {
        search: params.query || undefined,
        status: params.activeTab !== 'All' ? params.activeTab : undefined,
        sortBy: params.sortCol || undefined,
        sortDir: params.sortDir,
      };
      return this.tenantService.getAll(params.pageIndex + 1, params.pageSize, filters);
    },
  });

  tenants = computed(() => this.tenantsResource.value() ?? createEmptyPaginatedResponse<TenantDto>());

  onRowClick(tenant: TenantDto): void {
    this.router.navigate(['./', tenant.id], { relativeTo: this.activatedRoute });
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.tenantsResource.reload();
  }
}
