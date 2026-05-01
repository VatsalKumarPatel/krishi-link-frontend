import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { SupplierPaymentService } from '@services/supplier-payment.service';
import { SupplierService } from '@services/supplier.service';
import { StorePickerService } from '@services/store-picker.service';
import { SupplierSummaryDto } from '@models/supplier.model';
import { OutstandingInvoiceDto, PaymentAllocationLineCommand } from '@models/supplier-payment.model';

type PayMode = 'Cash' | 'UPI' | 'Cheque' | 'NEFT';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent],
  templateUrl: './payment-form.component.html',
})
export class PaymentFormComponent implements OnInit {
  private readonly paymentService = inject(SupplierPaymentService);
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly storePicker = inject(StorePickerService);

  // Mode tabs
  mode = signal<PayMode>('Cash');

  // Common
  supplierId = signal('');
  supplierSearch = signal('');
  supplierResults = signal<SupplierSummaryDto[]>([]);
  showSupplierDrop = signal(false);
  storeId = signal('');
  amount = signal(0);
  paymentDate = signal(new Date().toISOString().substring(0, 10));
  notes = signal('');

  // UPI
  upiTxnId = signal('');
  upiVpa = signal('');

  // Cheque
  chequeNumber = signal('');
  chequeBank = signal('');
  chequeBranch = signal('');
  chequeDate = signal(new Date().toISOString().substring(0, 10));

  // NEFT/RTGS/IMPS
  neftRef = signal('');
  bankName = signal('');
  valueDate = signal(new Date().toISOString().substring(0, 10));

  // Inline allocation
  showAllocation = signal(false);
  outstandingInvoices = signal<OutstandingInvoiceDto[]>([]);
  allocationAmounts = signal<Record<string, number>>({});

  saving = signal(false);
  error = signal<string | null>(null);

  readonly totalAllocated = computed(() =>
    Object.values(this.allocationAmounts()).reduce((s, v) => s + (v || 0), 0)
  );

  readonly advanceWarning = computed(() => {
    const diff = this.amount() - this.totalAllocated();
    return this.showAllocation() && diff > 0 ? diff : 0;
  });

  ngOnInit(): void {
    const store = this.storePicker.selectedStore();
    if (store) this.storeId.set(store.id);
    const supplierId = this.route.snapshot.queryParamMap.get('supplierId');
    if (supplierId) this.supplierId.set(supplierId);
  }

  searchSupplier(term: string): void {
    this.supplierSearch.set(term);
    if (term.length < 2) { this.supplierResults.set([]); return; }
    this.supplierService.search(term).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => { this.supplierResults.set(r); this.showSupplierDrop.set(true); },
    });
  }

  selectSupplier(s: SupplierSummaryDto): void {
    this.supplierId.set(s.id); this.supplierSearch.set(s.name);
    this.showSupplierDrop.set(false); this.supplierResults.set([]);
    if (this.showAllocation()) this.loadOutstanding();
  }

  toggleAllocation(): void {
    this.showAllocation.update(v => !v);
    if (this.showAllocation() && this.supplierId()) this.loadOutstanding();
  }

  loadOutstanding(): void {
    this.paymentService.getOutstandingInvoices(this.supplierId())
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => { this.outstandingInvoices.set(r); },
      });
  }

  setAllocation(purchaseId: string, val: number): void {
    this.allocationAmounts.update(m => ({ ...m, [purchaseId]: val }));
  }

  applyOldestFirst(): void {
    let remaining = this.amount();
    const updated: Record<string, number> = {};
    for (const inv of this.outstandingInvoices()) {
      if (remaining <= 0) break;
      const apply = Math.min(remaining, inv.outstandingAmount);
      updated[inv.purchaseId] = apply;
      remaining -= apply;
    }
    this.allocationAmounts.set(updated);
  }

  save(): void {
    this.error.set(null);
    if (!this.supplierId() || !this.storeId() || !this.amount() || this.amount() <= 0) {
      this.error.set('Supplier, Store and Amount are required.'); return;
    }

    const base = {
      supplierId: this.supplierId(),
      storeId: this.storeId(),
      amountPaid: this.amount(),
      paymentDate: this.paymentDate(),
      notes: this.notes().trim() || null,
    };

    this.saving.set(true);
    let req$;
    switch (this.mode()) {
      case 'UPI':
        req$ = this.paymentService.recordUpi({ ...base, upiTransactionId: this.upiTxnId(), upiVpa: this.upiVpa() || null });
        break;
      case 'Cheque':
        req$ = this.paymentService.recordCheque({ ...base, chequeNumber: this.chequeNumber(), chequeBank: this.chequeBank(), chequeBranch: this.chequeBranch() || null, chequeDate: this.chequeDate() });
        break;
      case 'NEFT':
        req$ = this.paymentService.recordNeft({ ...base, neftImpsRef: this.neftRef(), bankName: this.bankName(), valueDate: this.valueDate() });
        break;
      default:
        req$ = this.paymentService.recordCash(base);
    }

    req$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (payment) => {
        const allocLines: PaymentAllocationLineCommand[] = Object.entries(this.allocationAmounts())
          .filter(([, v]) => v > 0)
          .map(([purchaseId, amount]) => ({ purchaseId, amount }));

        if (allocLines.length > 0) {
          this.paymentService.allocate(payment.id, { allocations: allocLines })
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
              next: () => { this.saving.set(false); this.router.navigate(['/purchase/supplier-payments', payment.id]); },
              error: () => { this.saving.set(false); this.router.navigate(['/purchase/supplier-payments', payment.id]); },
            });
        } else {
          this.saving.set(false);
          this.router.navigate(['/purchase/supplier-payments', payment.id]);
        }
      },
      error: (err) => { this.saving.set(false); this.error.set(err.error?.detail ?? 'Failed to record payment.'); },
    });
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
