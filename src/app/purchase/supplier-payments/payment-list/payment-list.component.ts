import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { SupplierPaymentService } from '@services/supplier-payment.service';
import {
  SupplierPaymentSummaryDto,
  PAYMENT_MODE_LABELS,
  SUPPLIER_PAYMENT_STATUS_LABELS,
} from '@models/supplier-payment.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './payment-list.component.html',
})
export class PaymentListComponent implements OnInit {
  private readonly paymentService = inject(SupplierPaymentService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = 20;
  readonly modeLabels = PAYMENT_MODE_LABELS;
  readonly statusLabels = SUPPLIER_PAYMENT_STATUS_LABELS;

  payments = signal<SupplierPaymentSummaryDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  currentPage = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);

  supplierIdFilter = signal<string | undefined>(undefined);

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    if (qp.get('supplierId')) this.supplierIdFilter.set(qp.get('supplierId')!);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.paymentService.getAll(this.currentPage(), this.pageSize, this.supplierIdFilter())
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => {
          this.payments.set(r.items);
          this.totalCount.set(r.totalCount);
          this.totalPages.set(r.totalPages);
          this.hasPreviousPage.set(r.hasPreviousPage);
          this.hasNextPage.set(r.hasNextPage);
          this.loading.set(false);
        },
        error: () => { this.error.set('Failed to load payments.'); this.loading.set(false); },
      });
  }

  prevPage(): void { if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); } }

  pageRange(): string {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalCount());
    return `${start}–${end} of ${this.totalCount()}`;
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
