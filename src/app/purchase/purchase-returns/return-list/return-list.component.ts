import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { PurchaseReturnService } from '@services/purchase-return.service';
import { PurchaseReturnSummaryDto, RETURN_STATUS_LABELS, PurchaseReturnStatus } from '@models/purchase-return.model';

type StatusBadge = 'neutral' | 'warning' | 'success';

@Component({
  selector: 'app-return-list',
  standalone: true,
  imports: [RouterLink, SlicePipe, KlCardComponent, BadgeComponent],
  templateUrl: './return-list.component.html',
})
export class ReturnListComponent implements OnInit {
  private readonly returnService = inject(PurchaseReturnService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = 20;
  readonly statusLabels = RETURN_STATUS_LABELS;

  returns = signal<PurchaseReturnSummaryDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  currentPage = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.returnService.getAll(this.currentPage(), this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => {
          this.returns.set(r.items);
          this.totalCount.set(r.totalCount);
          this.totalPages.set(r.totalPages);
          this.hasPreviousPage.set(r.hasPreviousPage);
          this.hasNextPage.set(r.hasNextPage);
          this.loading.set(false);
        },
        error: () => { this.error.set('Failed to load returns.'); this.loading.set(false); },
      });
  }

  prevPage(): void { if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); } }

  statusBadge(s: PurchaseReturnStatus): StatusBadge {
    if (s === PurchaseReturnStatus.Draft) return 'neutral';
    if (s === PurchaseReturnStatus.Dispatched) return 'warning';
    return 'success';
  }

  pageRange(): string {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalCount());
    return `${start}–${end} of ${this.totalCount()}`;
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
