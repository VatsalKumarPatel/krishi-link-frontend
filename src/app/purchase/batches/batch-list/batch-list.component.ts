import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { environment } from '@app/environment';

interface BatchDto {
  id: string;
  batchNumber: string;
  productName: string;
  supplierName: string;
  expiryDate: string;
  quantityAvailableInBase: number;
  costPricePerUnit: number;
  isActive: boolean;
}

interface BatchPagedResult {
  items: BatchDto[];
  totalCount: number; page: number; pageSize: number;
  totalPages: number; hasPreviousPage: boolean; hasNextPage: boolean;
}

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe, KlCardComponent, BadgeComponent],
  templateUrl: './batch-list.component.html',
})
export class BatchListComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/batches`;

  readonly pageSize = 20;
  batches = signal<BatchDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  currentPage = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);

  showExpired = signal(false);
  showDepleted = signal(false);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    let params = new HttpParams()
      .set('page', String(this.currentPage())).set('pageSize', String(this.pageSize))
      .set('showExpired', String(this.showExpired())).set('showDepleted', String(this.showDepleted()));
    this.http.get<BatchPagedResult>(this.base, { params }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => { this.batches.set(r.items); this.totalCount.set(r.totalCount); this.totalPages.set(r.totalPages); this.hasPreviousPage.set(r.hasPreviousPage); this.hasNextPage.set(r.hasNextPage); this.loading.set(false); },
      error: () => { this.error.set('Failed to load batches.'); this.loading.set(false); },
    });
  }

  prevPage(): void { if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); } }

  expiryStatus(expiryDate: string): 'expired' | 'expiring-soon' | 'ok' {
    const exp = new Date(expiryDate);
    const now = new Date();
    if (exp < now) return 'expired';
    const thirtyDays = new Date(); thirtyDays.setDate(thirtyDays.getDate() + 30);
    if (exp <= thirtyDays) return 'expiring-soon';
    return 'ok';
  }

  rowStyle(expiryDate: string): string {
    const s = this.expiryStatus(expiryDate);
    if (s === 'expired') return 'background:#FEF2F2;';
    if (s === 'expiring-soon') return 'background:#FFFBEB;';
    return '';
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
