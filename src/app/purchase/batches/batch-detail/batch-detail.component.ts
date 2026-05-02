import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { environment } from '@app/environment';

interface BatchDetailDto {
  id: string;
  batchNumber: string;
  productName: string;
  supplierName: string;
  expiryDate: string;
  manufactureDate: string | null;
  quantityReceivedInBase: number;
  quantityAvailableInBase: number;
  costPricePerUnit: number;
  isActive: boolean;
}

@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [RouterLink, SlicePipe, KlCardComponent, BadgeComponent],
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.scss'],
})
export class BatchDetailComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  batch = signal<BatchDetailDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    const url = `${environment.apiBaseUrl}/${environment.version}/batches/${id}`;
    this.http.get<BatchDetailDto>(url).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (b) => { this.batch.set(b); this.loading.set(false); },
      error: () => { this.error.set('Failed to load batch.'); this.loading.set(false); },
    });
  }

  isExpired(): boolean { return this.batch() ? new Date(this.batch()!.expiryDate) < new Date() : false; }
  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(n); }
}
