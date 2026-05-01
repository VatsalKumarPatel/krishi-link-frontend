import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { SupplierPaymentService } from '@services/supplier-payment.service';
import { SupplierPaymentDetailDto, OutstandingInvoiceDto, PaymentAllocationLineCommand } from '@models/supplier-payment.model';

@Component({
  selector: 'app-payment-allocate',
  standalone: true,
  imports: [RouterLink, SlicePipe, KlCardComponent],
  templateUrl: './payment-allocate.component.html',
})
export class PaymentAllocateComponent implements OnInit {
  private readonly paymentService = inject(SupplierPaymentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  payment = signal<SupplierPaymentDetailDto | null>(null);
  invoices = signal<OutstandingInvoiceDto[]>([]);
  allocationAmounts = signal<Record<string, number | undefined>>({});
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  readonly totalAllocating = computed(() =>
    Object.values(this.allocationAmounts()).reduce((s, v) => s + (v ?? 0), 0)
  );

  readonly remaining = computed(() => {
    const p = this.payment();
    return p ? p.unallocatedAmount - this.totalAllocating() : 0;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.paymentService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (p) => {
        this.payment.set(p);
        this.loading.set(false);
        this.paymentService.getOutstandingInvoices(p.supplierId)
          .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (inv) => this.invoices.set(inv) });
      },
      error: () => { this.error.set('Failed to load payment.'); this.loading.set(false); },
    });
  }

  setAmount(purchaseId: string, val: number): void {
    this.allocationAmounts.update(m => ({ ...m, [purchaseId]: val }));
  }

  applyOldestFirst(): void {
    let remaining = this.payment()?.unallocatedAmount ?? 0;
    const updated: Record<string, number> = {};
    for (const inv of this.invoices()) {
      if (remaining <= 0) break;
      const apply = Math.min(remaining, inv.outstandingAmount);
      updated[inv.purchaseId] = apply;
      remaining -= apply;
    }
    this.allocationAmounts.set(updated);
  }

  confirm(): void {
    const lines: PaymentAllocationLineCommand[] = Object.entries(this.allocationAmounts())
      .filter(([, v]) => v > 0)
      .map(([purchaseId, amount]) => ({ purchaseId, amount }));

    if (lines.length === 0) { this.error.set('No amounts entered.'); return; }
    if (this.totalAllocating() > (this.payment()?.unallocatedAmount ?? 0)) {
      this.error.set('Total allocation exceeds unallocated balance.'); return;
    }

    this.saving.set(true); this.error.set(null);
    this.paymentService.allocate(this.payment()!.id, { allocations: lines })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.saving.set(false); this.router.navigate(['/purchase/supplier-payments', this.payment()!.id]); },
        error: (err) => { this.saving.set(false); this.error.set(err.error?.detail ?? 'Failed to allocate.'); },
      });
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
