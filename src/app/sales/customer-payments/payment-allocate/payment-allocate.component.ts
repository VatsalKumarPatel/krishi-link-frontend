import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { CustomerPaymentDetailDto, OutstandingSaleRow } from '@models/customer-payment.model';

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
  upiTransactionId: null, upiVpa: null,
  chequeNumber: null, chequeBank: null, chequeBranch: null, chequeDate: null, chequeClearanceDate: null, chequeBounced: false,
  neftImpsRef: 'NEFT2026041000012', bankName: 'State Bank of India', valueDate: '2026-04-10',
  verifiedAt: '2026-04-11', reversedAt: null, reversalReason: null,
  allocations: [
    { id: 'a001', saleRef: 'SALE-DEL-2026-00131', invoiceNumber: 'INV-DEL-2026-00047', saleDate: '2026-03-15', allocatedAmount: 22000, allocatedAt: '2026-04-11', isReversed: false, reversalReason: null },
    { id: 'a002', saleRef: 'SALE-DEL-2026-00118', invoiceNumber: 'INV-DEL-2026-00031', saleDate: '2026-03-02', allocatedAmount: 15000, allocatedAt: '2026-04-11', isReversed: false, reversalReason: null },
  ],
};

const MOCK_OUTSTANDING: OutstandingSaleRow[] = [
  { saleId: 's001', saleRef: 'SALE-DEL-2026-00131', invoiceNumber: 'INV-DEL-2026-00047', saleDate: '2026-03-15', dueDate: '2026-04-14', totalAmount: 38350, outstandingAmount: 16350 },
  { saleId: 's002', saleRef: 'SALE-DEL-2026-00118', invoiceNumber: 'INV-DEL-2026-00031', saleDate: '2026-03-02', dueDate: '2026-04-01', totalAmount: 29500, outstandingAmount: 14500 },
  { saleId: 's003', saleRef: 'SALE-DEL-2026-00105', invoiceNumber: 'INV-DEL-2026-00018', saleDate: '2026-02-18', dueDate: '2026-03-20', totalAmount: 15000, outstandingAmount: 15000 },
];

@Component({
  selector: 'app-payment-allocate',
  standalone: true,
  imports: [RouterLink, KlCardComponent],
  templateUrl: './payment-allocate.component.html',
  styleUrl: './payment-allocate.component.scss',
})
export class PaymentAllocateComponent {
  readonly payment  = signal<CustomerPaymentDetailDto>(MOCK_PAYMENT);
  readonly invoices = signal<OutstandingSaleRow[]>(MOCK_OUTSTANDING);
  readonly allocationAmounts = signal<Record<string, number | undefined>>({});
  readonly saving = signal(false);
  readonly error  = signal<string | null>(null);

  readonly totalAllocating = computed(() =>
    Object.values(this.allocationAmounts()).reduce((s: number, v) => s + (v ?? 0), 0)
  );

  readonly remaining = computed(() => this.payment().unallocatedAmount - this.totalAllocating());

  setAmount(saleId: string, val: number): void {
    this.allocationAmounts.update(m => ({ ...m, [saleId]: val }));
  }

  applyOldestFirst(): void {
    let remaining = this.payment().unallocatedAmount;
    const updated: Record<string, number> = {};
    for (const inv of this.invoices()) {
      if (remaining <= 0) break;
      const apply = Math.min(remaining, inv.outstandingAmount);
      updated[inv.saleId] = apply;
      remaining -= apply;
    }
    this.allocationAmounts.set(updated);
  }

  confirm(): void {
    if (this.totalAllocating() === 0) { this.error.set('No amounts entered.'); return; }
    if (this.totalAllocating() > this.payment().unallocatedAmount) {
      this.error.set('Total allocation exceeds unallocated balance.'); return;
    }
    this.saving.set(true); this.error.set(null);
    setTimeout(() => { this.saving.set(false); }, 600);
  }

  fmt(n: number): string { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}
