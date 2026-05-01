import { Component, signal, inject, DestroyRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { SupplierSummaryDto } from '@models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent, BadgeComponent],
  templateUrl: './supplier-list.component.html',
})
export class SupplierListComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();
  readonly userService = inject(UserService);

  readonly pageSize = 20;

  suppliers = signal<SupplierSummaryDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  currentPage = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);

  searchValue = signal('');
  isActiveFilter = signal<boolean | undefined>(undefined);

  // Deactivate confirm
  confirmDeactivateId = signal<string | null>(null);
  deactivating = signal(false);

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => { this.currentPage.set(1); this.load(); });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.supplierService.getAll(
      this.currentPage(), this.pageSize,
      this.searchValue() || undefined,
      this.isActiveFilter(),
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        this.suppliers.set(r.items);
        this.totalCount.set(r.totalCount);
        this.totalPages.set(r.totalPages);
        this.hasPreviousPage.set(r.hasPreviousPage);
        this.hasNextPage.set(r.hasNextPage);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load suppliers. Please try again.'); this.loading.set(false); },
    });
  }

  onSearch(value: string): void { this.searchValue.set(value); this.searchSubject.next(value); }

  setFilter(val: boolean | undefined): void {
    this.isActiveFilter.set(val);
    this.currentPage.set(1);
    this.load();
  }

  prevPage(): void { if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); } }

  pageRange(): string {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalCount());
    return `${start}–${end} of ${this.totalCount()}`;
  }

  isTenantAdmin(): boolean {
    return this.userService.profile()?.staffRole === 'TenantAdmin';
  }

  promptDeactivate(id: string, e: Event): void { e.stopPropagation(); this.confirmDeactivateId.set(id); }
  cancelDeactivate(): void { this.confirmDeactivateId.set(null); }

  confirmDeactivate(): void {
    const id = this.confirmDeactivateId();
    if (!id) return;
    this.deactivating.set(true);
    this.supplierService.deactivate(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.confirmDeactivateId.set(null); this.deactivating.set(false); this.load(); },
      error: () => { this.deactivating.set(false); },
    });
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
