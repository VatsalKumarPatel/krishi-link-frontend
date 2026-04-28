import { Component, Input, signal, OnInit, OnChanges, SimpleChanges, inject, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../../shared/kl-card/kl-card.component';
import { BadgeComponent, BadgeVariant } from '../../../../shared/badge/badge.component';
import { StoreAddComponent } from '../store-add/store-add.component';
import { StoreService } from '@services/store.service';
import { StoreDto, StoreListFilters } from '@models/store.model';

type SortCol = 'name' | 'city' | 'tenantName' | 'isActive';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent, BadgeComponent, StoreAddComponent],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss',
})
export class StoresListComponent implements OnInit, OnChanges {
  /** When set, filters stores by this tenant and hides the Tenant column. */
  @Input() tenantId: string | null = null;

  /** When true, hides the page-level header and renders as an embedded card. */
  @Input() embedded = false;

  private readonly storeService = inject(StoreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  readonly pageSize = 20;

  // ── Data ────────────────────────────────────────────────────────────────────
  stores = signal<StoreDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);
  currentPage = signal(1);

  // ── Filters ─────────────────────────────────────────────────────────────────
  searchValue = signal('');
  sortCol = signal<SortCol>('name');
  sortDir = signal<'asc' | 'desc'>('asc');

  // ── Drawer ──────────────────────────────────────────────────────────────────
  drawerOpen = signal(false);
  editStore = signal<StoreDto | null>(null);

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    // If tenantId changes after init, reset and reload
    if (changes['tenantId'] && !changes['tenantId'].firstChange) {
      this.currentPage.set(1);
      this.load();
    }
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters: StoreListFilters = {
      search: this.searchValue() || undefined,
      tenantId: this.tenantId ?? undefined,
      sortBy: this.sortCol(),
      sortDir: this.sortDir(),
    };

    this.storeService.getAll(this.currentPage(), this.pageSize, filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.stores.set(result.items);
          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages);
          this.hasPreviousPage.set(result.hasPreviousPage);
          this.hasNextPage.set(result.hasNextPage);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load stores. Please try again.');
          this.loading.set(false);
        },
      });
  }

  onSearch(value: string): void {
    this.searchValue.set(value);
    this.searchSubject.next(value);
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

  prevPage(): void {
    if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); }
  }

  nextPage(): void {
    if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); }
  }

  openAdd(): void { this.editStore.set(null); this.drawerOpen.set(true); }

  openEdit(s: StoreDto, e: Event): void {
    e.stopPropagation();
    this.editStore.set(s);
    this.drawerOpen.set(true);
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.load();
  }

  statusVariant(isActive: boolean): BadgeVariant { return isActive ? 'success' : 'neutral'; }
  statusLabel(isActive: boolean): string { return isActive ? 'Active' : 'Inactive'; }

  initials(name: string | null): string {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  cityState(s: StoreDto): string {
    const parts = [s.city, s.state].filter((v): v is string => !!v);
    return parts.length ? parts.join(', ') : '—';
  }

  pageRange(): string {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalCount());
    return `${start}–${end} of ${this.totalCount()}`;
  }
}
