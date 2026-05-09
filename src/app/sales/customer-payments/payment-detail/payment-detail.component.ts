import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import {
  CustomerPaymentDetailDto,
  CustomerPaymentStatus,
  CUSTOMER_PAYMENT_STATUS_BADGE,
  CUSTOMER_PAYMENT_MODE_LABELS,
} from '@models/customer-payment.model';

const MOCK_PAYMENT: CustomerPaymentDetailDto = {
  id: 'cp001',
  paymentRef: 'PMT-DEL-2026-00089',
  farmerId: 'f001',
  farmerName: 'Ramesh Kumar',
  farmerCode: 'FARM-DEL-0042',
  storeName: 'KrishiLink Store – Delhi North',
  status: 'Verified',
  mode: 'NEFT',
  amountReceived: 45000,
  amountAllocated: 37000,
  unallocatedAmount: 8000,
  paymentDate: '2026-04-10',
  notes: 'Received against April dues',
  upiTransactionId: null,
  upiVpa: null,
  chequeNumber: null,
  chequeBank: null,
  chequeBranch: null,
  chequeDate: null,
  chequeClearanceDate: null,
  chequeBounced: false,
  neftImpsRef: 'NEFT2026041000012',
  bankName: 'State Bank of India',
  valueDate: '2026-04-10',
  verifiedAt: '2026-04-11',
  reversedAt: null,
  reversalReason: null,
  allocations: [
    { id: 'a001', saleRef: 'SALE-DEL-2026-00131', invoiceNumber: 'INV-DEL-2026-00047', saleDate: '2026-03-15', allocatedAmount: 22000, allocatedAt: '2026-04-11', isReversed: false, reversalReason: null },
    { id: 'a002', saleRef: 'SALE-DEL-2026-00118', invoiceNumber: 'INV-DEL-2026-00031', saleDate: '2026-03-02', allocatedAmount: 15000, allocatedAt: '2026-04-11', isReversed: false, reversalReason: null },
  ],
};

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.scss',
})
export class PaymentDetailComponent {
  readonly payment = signal<CustomerPaymentDetailDto>(MOCK_PAYMENT);
  readonly activeTab = signal<'allocations' | 'details'>('allocations');

  readonly showVerifyDialog  = signal(false);
  readonly showBounceDialog  = signal(false);
  readonly showReverseDialog = signal(false);
  readonly dialogReason      = signal('');
  readonly clearanceDate     = signal('');
  readonly acting            = signal(false);
  readonly actionError       = signal<string | null>(null);

  readonly modeLabels = CUSTOMER_PAYMENT_MODE_LABELS;
  readonly statusBadge = CUSTOMER_PAYMENT_STATUS_BADGE;

  readonly canVerify  = computed(() => this.payment().status === 'Recorded' && (this.payment().mode === 'Cheque' || this.payment().mode === 'NEFT'));
  readonly canBounce  = computed(() => this.payment().mode === 'Cheque' && !this.payment().chequeBounced && this.payment().status !== 'Reversed');
  readonly canReverse = computed(() => this.payment().unallocatedAmount > 0 && this.payment().status !== 'Reversed');

  initials(name: string): string { return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase(); }

  statusVariant(): 'neutral' | 'info' | 'warning' | 'success' | 'danger' {
    return (CUSTOMER_PAYMENT_STATUS_BADGE[this.payment().status] ?? 'neutral') as any;
  }

  openDialog(type: 'verify' | 'bounce' | 'reverse'): void {
    this.dialogReason.set(''); this.clearanceDate.set(''); this.actionError.set(null);
    if (type === 'verify')  this.showVerifyDialog.set(true);
    if (type === 'bounce')  this.showBounceDialog.set(true);
    if (type === 'reverse') this.showReverseDialog.set(true);
  }

  closeDialogs(): void {
    this.showVerifyDialog.set(false);
    this.showBounceDialog.set(false);
    this.showReverseDialog.set(false);
  }

  verify(): void {
    this.acting.set(true);
    setTimeout(() => {
      this.payment.update(p => ({ ...p, status: 'Verified' as CustomerPaymentStatus, verifiedAt: new Date().toISOString().substring(0, 10) }));
      this.showVerifyDialog.set(false); this.acting.set(false);
    }, 400);
  }

  bounce(): void {
    if (!this.dialogReason().trim()) { this.actionError.set('Reason required.'); return; }
    this.acting.set(true);
    setTimeout(() => {
      this.payment.update(p => ({ ...p, chequeBounced: true }));
      this.showBounceDialog.set(false); this.acting.set(false);
    }, 400);
  }

  reverse(): void {
    if (!this.dialogReason().trim()) { this.actionError.set('Reason required.'); return; }
    this.acting.set(true);
    setTimeout(() => {
      this.payment.update(p => ({ ...p, status: 'Reversed' as CustomerPaymentStatus, reversedAt: new Date().toISOString().substring(0, 10), reversalReason: this.dialogReason() }));
      this.showReverseDialog.set(false); this.acting.set(false);
    }, 400);
  }

  fmt(n: number): string { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}
