import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../../shared/kl-card/kl-card.component';
import { BadgeVariant } from '../../../../shared/badge/badge.component';
import { TenantAddComponent } from '../tenant-add/tenant-add.component';
import { TenantService } from '@services/tenant.service';
import { TenantDto, TenantListFilters } from '@models/tenant.model';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { createEmptyPaginatedResponse, PaginatedResponse } from '@app/models/pagination.model';

type SortCol = 'name' | 'city' | 'storeCount' | 'subscriptionExpiresAt';
type TabStatus = 'All' | 'Active' | 'Inactive';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [FormsModule, KlCardComponent, TenantAddComponent, KlGridComponent],
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.scss',
})
export class TenantsListComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  // ── Filters ─────────────────────────────────────────────────────────────────
  activeTab = signal<TabStatus>('All');
  sortCol = signal<SortCol>('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  openFilter = signal<string | null>(null);

  // ── Drawer ──────────────────────────────────────────────────────────────────
  drawerOpen = signal(false);
  editTenant = signal<TenantDto | null>(null);

  columns: GridColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'addressLine1', header: 'Address' },
    { field: 'storeCount', header: 'Stores', type: 'badge', sortable: false,
      badgeVariant: (v: number) => v > 0 ? 'info' : 'neutral' },
    { field: 'city', header: 'City' },
    { field: 'subscriptionExpiresAt', header: 'Expires', type: 'date', dateFormat: 'd MMM yyyy' },
  ];

  query = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);
  sorting = signal('name');

  private tenantQueryParams = computed(() => ({
    query: this.query(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    sort: this.sorting(),
    activeTab: this.activeTab(),
    sortCol: this.sortCol(),
    sortDir: this.sortDir(),
  }));

  tenantsResource = rxResource<PaginatedResponse<TenantDto>, ReturnType<TenantsListComponent['tenantQueryParams']>>({
    params: () => this.tenantQueryParams(),
    stream: ({ params }) => {
      const filters: TenantListFilters = {
        search: params.query || undefined,
        status: params.activeTab !== 'All' ? params.activeTab : undefined,
        sortBy: params.sortCol,
        sortDir: params.sortDir,
      };
      return this.tenantService.getAll(params.pageIndex + 1, params.pageSize, filters);
    }
  });

  tenants = computed(() => this.tenantsResource.value() ?? createEmptyPaginatedResponse<TenantDto>());

  ngOnInit(): void {}

  // ── Filter / sort handlers ──────────────────────────────────────────────────

  onSearch(value: string): void {
    this.query.set(value);
    this.pageIndex.set(0);
  }

  setTab(tab: TabStatus): void {
    this.activeTab.set(tab);
    this.pageIndex.set(0);
  }

  toggleSort(col: SortCol): void {
    if (this.sortCol() === col) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortCol.set(col);
      this.sortDir.set('asc');
    }
    this.pageIndex.set(0);
  }

  toggleFilter(name: string): void {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  // ── Pagination ──────────────────────────────────────────────────────────────

  prevPage(): void {
    if (this.tenants().hasPreviousPage) {
      this.pageIndex.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.tenants().hasNextPage) {
      this.pageIndex.update(p => p + 1);
    }
  }

  // ── Drawer ──────────────────────────────────────────────────────────────────

  openAdd(): void {
    this.editTenant.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(t: TenantDto): void {
    this.editTenant.set(t);
    this.drawerOpen.set(true);
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.tenantsResource.reload();
  }

  // ── Display helpers ─────────────────────────────────────────────────────────

  statusVariant(isActive: boolean): BadgeVariant {
    return isActive ? 'success' : 'neutral';
  }

  statusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  initials(name: string | null): string {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  cityState(t: TenantDto): string {
    const parts = [t.city, t.state].filter((v): v is string => !!v);
    return parts.length ? parts.join(', ') : '—';
  }

  formatExpiry(date: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  pageRange(): string {
    const data = this.tenants();
    if (!data.totalCount) return '0 results';
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), data.totalCount);
    return `${start}–${end} of ${data.totalCount}`;
  }

  toggleDetails(_productId: string): void {}

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: string): void {
    this.sorting.set(sort);
  }

  onRowClick(tenant: TenantDto): void {
    this.router.navigate(['./', tenant.id], { relativeTo: this.activatedRoute });
  }
}
