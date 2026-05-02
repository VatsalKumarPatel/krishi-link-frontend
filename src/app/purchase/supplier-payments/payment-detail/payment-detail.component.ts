import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { SupplierPaymentService } from '@services/supplier-payment.service';
import { UserService } from '@services/user.service';
import {
  SupplierPaymentDetailDto,
  PaymentMode,
  SupplierPaymentStatus,
  PAYMENT_MODE_LABELS,
  SUPPLIER_PAYMENT_STATUS_LABELS,
} from '@models/supplier-payment.model';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe, KlCardComponent, BadgeComponent],
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss'],
})
export class PaymentDetailComponent implements OnInit {
  private readonly paymentService = inject(SupplierPaymentService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);

  payment = signal<SupplierPaymentDetailDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Dialogs
  showBounceDialog = signal(false);
  showReverseDialog = signal(false);
  showVerifyDialog = signal(false);
  dialogReason = signal('');
  clearanceDate = signal('');
  acting = signal(false);
  actionError = signal<string | null>(null);

  readonly modeLabels = PAYMENT_MODE_LABELS;
  readonly statusLabels = SUPPLIER_PAYMENT_STATUS_LABELS;
  readonly PaymentMode = PaymentMode;
  readonly SupplierPaymentStatus = SupplierPaymentStatus;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  load(id?: string): void {
    const pid = id ?? this.payment()?.id;
    if (!pid) return;
    this.loading.set(true);
    this.paymentService.getById(pid).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (p) => { this.payment.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load payment.'); this.loading.set(false); },
    });
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  canVerify(): boolean {
    const p = this.payment();
    if (!p || !this.isStoreManager()) return false;
    const mode = p.mode as number;
    return p.status === SupplierPaymentStatus.Recorded &&
      (mode === PaymentMode.Cheque || mode === PaymentMode.NEFT || mode === PaymentMode.RTGS || mode === PaymentMode.IMPS);
  }

  canBounce(): boolean {
    const p = this.payment();
    return !!p && this.isStoreManager() && (p.mode as number) === PaymentMode.Cheque && p.status !== SupplierPaymentStatus.Reversed;
  }

  canReverse(): boolean {
    const p = this.payment();
    return !!p && this.isStoreManager() && p.unallocatedAmount > 0 && p.status !== SupplierPaymentStatus.Reversed;
  }

  verify(): void {
    this.acting.set(true); this.actionError.set(null);
    this.paymentService.verify(this.payment()!.id, { clearanceDate: this.clearanceDate() || null })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (p) => { this.payment.set(p); this.showVerifyDialog.set(false); this.acting.set(false); },
        error: (err) => { this.acting.set(false); this.actionError.set(err.error?.detail ?? 'Failed.'); },
      });
  }

  bounce(): void {
    if (!this.dialogReason().trim()) { this.actionError.set('Reason required.'); return; }
    this.acting.set(true); this.actionError.set(null);
    this.paymentService.bounce(this.payment()!.id, { reason: this.dialogReason() })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (p) => { this.payment.set(p); this.showBounceDialog.set(false); this.acting.set(false); },
        error: (err) => { this.acting.set(false); this.actionError.set(err.error?.detail ?? 'Failed.'); },
      });
  }

  reverse(): void {
    if (!this.dialogReason().trim()) { this.actionError.set('Reason required.'); return; }
    this.acting.set(true); this.actionError.set(null);
    this.paymentService.reverse(this.payment()!.id, { reason: this.dialogReason() })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (p) => { this.payment.set(p); this.showReverseDialog.set(false); this.acting.set(false); },
        error: (err) => { this.acting.set(false); this.actionError.set(err.error?.detail ?? 'Failed.'); },
      });
  }

  openDialog(type: 'bounce' | 'reverse' | 'verify'): void {
    this.dialogReason.set(''); this.clearanceDate.set(''); this.actionError.set(null);
    if (type === 'bounce') this.showBounceDialog.set(true);
    else if (type === 'reverse') this.showReverseDialog.set(true);
    else this.showVerifyDialog.set(true);
  }

  closeDialogs(): void {
    this.showBounceDialog.set(false); this.showReverseDialog.set(false); this.showVerifyDialog.set(false);
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
