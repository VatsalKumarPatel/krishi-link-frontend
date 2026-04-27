import { Component, signal, OnInit, inject, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../../shared/kl-card/kl-card.component';
import { BadgeComponent, BadgeVariant } from '../../../../shared/badge/badge.component';
import { TenantAddComponent } from '../tenant-add/tenant-add.component';
import { TenantService } from '@services/tenant.service';
import { TenantDto, TenantListFilters } from '@models/tenant.model';

type SortCol = 'name' | 'city' | 'storeCount' | 'subscriptionExpiresAt';
type TabStatus = 'All' | 'Active' | 'Inactive';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent, BadgeComponent, TenantAddComponent],
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.scss',
})
export class TenantsListComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  readonly pageSize = 20;

  // ── Data ────────────────────────────────────────────────────────────────────
  tenants = signal<TenantDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);
  currentPage = signal(1);

  // ── Filters ─────────────────────────────────────────────────────────────────
  searchValue = signal('');
  activeTab = signal<TabStatus>('All');
  sortCol = signal<SortCol>('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  openFilter = signal<string | null>(null);

  // ── Drawer ──────────────────────────────────────────────────────────────────
  drawerOpen = signal(false);
  editTenant = signal<TenantDto | null>(null);

  ngOnInit(): void {
    // Debounce search input — triggers a fresh load from page 1
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.currentPage.set(1);
      this.load();
    });

    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const tab = this.activeTab();
    const filters: TenantListFilters = {
      search: this.searchValue() || undefined,
      status: tab !== 'All' ? tab : undefined,
      sortBy: this.sortCol(),
      sortDir: this.sortDir(),
    };

    this.tenantService.getAll(this.currentPage(), this.pageSize, filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.tenants.set(result.items);
          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages);
          this.hasPreviousPage.set(result.hasPreviousPage);
          this.hasNextPage.set(result.hasNextPage);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load tenants. Please try again.');
          this.loading.set(false);
        },
      });
  }

  // ── Filter / sort handlers ──────────────────────────────────────────────────

  onSearch(value: string): void {
    this.searchValue.set(value);
    this.searchSubject.next(value);
  }

  setTab(tab: TabStatus): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.load();
  }

  toggleSort(col: SortCol): void {
    if (this.sortCol() === col) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortCol.set(col);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
    this.load();
  }

  toggleFilter(name: string): void {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  // ── Pagination ──────────────────────────────────────────────────────────────

  prevPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage.update(p => p - 1);
      this.load();
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update(p => p + 1);
      this.load();
    }
  }

  // ── Drawer ──────────────────────────────────────────────────────────────────

  openAdd(): void {
    this.editTenant.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(t: TenantDto, e: Event): void {
    e.stopPropagation();
    this.editTenant.set(t);
    this.drawerOpen.set(true);
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.load();
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

  /** Human-readable page range, e.g. "1–20 of 48" */
  pageRange(): string {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalCount());
    return `${start}–${end} of ${this.totalCount()}`;
  }
}
