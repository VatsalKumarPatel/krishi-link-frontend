import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { OutstandingSaleRow } from '@models/customer-payment.model';

interface MockFarmer {
  id: string;
  farmerCode: string;
  farmerName: string;
}

const MOCK_FARMERS: MockFarmer[] = [
  { id: 'f001', farmerCode: 'FARM-DEL-0042', farmerName: 'Ramesh Kumar' },
  { id: 'f002', farmerCode: 'FARM-DEL-0031', farmerName: 'Sunita Poudel' },
  { id: 'f003', farmerCode: 'FARM-DEL-0055', farmerName: 'Arjun Rai' },
  { id: 'f004', farmerCode: 'FARM-DEL-0018', farmerName: 'Maya Gurung' },
  { id: 'f005', farmerCode: 'FARM-DEL-0072', farmerName: 'Raju Thapa' },
];

const MOCK_OUTSTANDING: Record<string, OutstandingSaleRow[]> = {
  f001: [
    { saleId: 's001', saleRef: 'SALE-DEL-2026-00131', invoiceNumber: 'INV-DEL-2026-00047', saleDate: '2026-03-15', dueDate: '2026-04-14', totalAmount: 38350, outstandingAmount: 16350 },
    { saleId: 's002', saleRef: 'SALE-DEL-2026-00118', invoiceNumber: 'INV-DEL-2026-00031', saleDate: '2026-03-02', dueDate: '2026-04-01', totalAmount: 29500, outstandingAmount: 14500 },
    { saleId: 's003', saleRef: 'SALE-DEL-2026-00105', invoiceNumber: 'INV-DEL-2026-00018', saleDate: '2026-02-18', dueDate: '2026-03-20', totalAmount: 15000, outstandingAmount: 15000 },
  ],
};

type PayMode = 'Cash' | 'UPI' | 'Cheque' | 'NEFT';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
})
export class PaymentFormComponent {
  protected readonly setTimeout = setTimeout;

  readonly modes: PayMode[] = ['Cash', 'UPI', 'Cheque', 'NEFT'];
  readonly mode = signal<PayMode>('Cash');

  readonly farmerSearch      = signal('');
  readonly showFarmerDrop    = signal(false);
  readonly selectedFarmer    = signal<MockFarmer | null>(null);
  readonly farmerResults     = computed(() => {
    const q = this.farmerSearch().toLowerCase();
    return q ? MOCK_FARMERS.filter(f => f.farmerName.toLowerCase().includes(q) || f.farmerCode.toLowerCase().includes(q)) : MOCK_FARMERS;
  });

  readonly amount      = signal(0);
  readonly paymentDate = signal(new Date().toISOString().substring(0, 10));
  readonly notes       = signal('');

  readonly upiTxnId   = signal('');
  readonly upiVpa     = signal('');

  readonly chequeNumber = signal('');
  readonly chequeBank   = signal('');
  readonly chequeBranch = signal('');
  readonly chequeDate   = signal(new Date().toISOString().substring(0, 10));

  readonly neftRef   = signal('');
  readonly bankName  = signal('');
  readonly valueDate = signal(new Date().toISOString().substring(0, 10));

  readonly showAllocation  = signal(false);
  readonly allocationAmounts = signal<Record<string, number | undefined>>({});
  readonly saving  = signal(false);
  readonly error   = signal<string | null>(null);

  readonly outstandingInvoices = computed<OutstandingSaleRow[]>(() => {
    const f = this.selectedFarmer();
    return f ? (MOCK_OUTSTANDING[f.id] ?? []) : [];
  });

  readonly totalAllocated = computed(() =>
    Object.values(this.allocationAmounts()).reduce((s: number, v) => s + (v ?? 0), 0)
  );

  readonly advanceWarning = computed(() => {
    const diff = this.amount() - this.totalAllocated();
    return this.showAllocation() && diff > 0 ? diff : 0;
  });

  selectFarmer(f: MockFarmer): void {
    this.selectedFarmer.set(f);
    this.farmerSearch.set(f.farmerName);
    this.showFarmerDrop.set(false);
    this.allocationAmounts.set({});
  }

  onFarmerInput(val: string): void {
    this.farmerSearch.set(val);
    this.showFarmerDrop.set(true);
    if (!val) { this.selectedFarmer.set(null); this.allocationAmounts.set({}); }
  }

  setAllocation(saleId: string, val: number): void {
    this.allocationAmounts.update(m => ({ ...m, [saleId]: val }));
  }

  applyOldestFirst(): void {
    let remaining = this.amount();
    const updated: Record<string, number> = {};
    for (const inv of this.outstandingInvoices()) {
      if (remaining <= 0) break;
      const apply = Math.min(remaining, inv.outstandingAmount);
      updated[inv.saleId] = apply;
      remaining -= apply;
    }
    this.allocationAmounts.set(updated);
  }

  save(): void {
    this.error.set(null);
    if (!this.selectedFarmer()) { this.error.set('Please select a farmer.'); return; }
    if (!this.amount() || this.amount() <= 0) { this.error.set('Amount is required.'); return; }
    this.saving.set(true);
    setTimeout(() => { this.saving.set(false); }, 600);
  }

  fmt(n: number): string { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}
