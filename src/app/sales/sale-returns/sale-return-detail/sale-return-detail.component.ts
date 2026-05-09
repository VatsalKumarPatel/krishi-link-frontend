import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { SaleReturnDetailDto, SaleReturnStatus } from '@models/sale.model';

const RETURN_STATUS_BADGE: Record<SaleReturnStatus, string> = {
  Draft: 'neutral',
  Confirmed: 'info',
  Credited: 'success',
};

const MOCK_RETURN: SaleReturnDetailDto = {
  id: 'r001',
  creditNoteNumber: 'CN-DEL-2026-00012',
  saleId: 's001',
  saleRef: 'SALE-DEL-2026-00131',
  farmerId: 'f001',
  farmerName: 'Govind Prasad',
  farmerCode: 'FARM-DEL-0042',
  storeName: 'KrishiLink Store – Delhi North',
  status: 'Credited',
  returnDate: '2026-04-08',
  reason: 'Quality issue — discoloured seeds',
  totalAmount: 8850,
  confirmedAt: '2026-04-09',
  creditedAt: '2026-04-10',
  items: [
    { id: 'ri001', productName: 'Wheat Seed HD-3385 (20kg)', unitName: 'Bag', quantity: 3, ratePerUnit: 2100, taxableAmount: 6300, taxRatePercent: 12, lineTotal: 7056 },
    { id: 'ri002', productName: 'DAP Fertilizer (50kg)',     unitName: 'Bag', quantity: 2, ratePerUnit: 850,  taxableAmount: 1700, taxRatePercent: 5,  lineTotal: 1785 },
  ],
};

@Component({
  selector: 'app-sale-return-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './sale-return-detail.component.html',
  styleUrl: './sale-return-detail.component.scss',
})
export class SaleReturnDetailComponent {
  readonly ret = signal<SaleReturnDetailDto>(MOCK_RETURN);

  readonly isConfirming = signal(false);
  readonly isCrediting  = signal(false);

  readonly statusVariant = computed(() => {
    return (RETURN_STATUS_BADGE[this.ret().status] ?? 'neutral') as 'neutral' | 'info' | 'success';
  });

  readonly canConfirm = computed(() => this.ret().status === 'Draft');
  readonly canCredit  = computed(() => this.ret().status === 'Confirmed');

  confirmReturn(): void {
    this.isConfirming.set(true);
    setTimeout(() => {
      this.ret.update(r => ({ ...r, status: 'Confirmed' as SaleReturnStatus, confirmedAt: new Date().toISOString().substring(0, 10) }));
      this.isConfirming.set(false);
    }, 400);
  }

  creditToAccount(): void {
    this.isCrediting.set(true);
    setTimeout(() => {
      this.ret.update(r => ({ ...r, status: 'Credited' as SaleReturnStatus, creditedAt: new Date().toISOString().substring(0, 10) }));
      this.isCrediting.set(false);
    }, 400);
  }

  initials(name: string): string { return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
  fmt(n: number): string { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}
