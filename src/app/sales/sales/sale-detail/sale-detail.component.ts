import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { SaleDetailDto, SaleStatus, SALE_STATUS_BADGE, SALE_STATUS_LABELS } from '@models/sale.model';
import { SaleItemAddComponent } from '../sale-item-add/sale-item-add.component';

const MOCK_SALE: SaleDetailDto = {
  id: 's001',
  saleRef: 'SALE-DEL-2026-00143',
  invoiceNumber: 'INV-DEL-2026-00143',
  farmerId: 'f001',
  farmerName: 'Ramesh Kumar',
  farmerCode: 'FARM-DEL-0042',
  storeName: 'Dehradun Main Store',
  status: 'PartiallyPaid',
  paymentMode: 'Credit',
  creditDays: 30,
  saleDate: '8 May 2026',
  dueDate: '7 Jun 2026',
  invoicedAt: '8 May 2026',
  seasonName: 'Kharif 2026',
  sellerGstin: '05AAACR1234H1Z5',
  buyerGstin: null,
  placeOfSupply: '05 – Uttarakhand',
  isInterState: false,
  subTotal: 20929,
  totalDiscount: 435,
  totalCgst: 787.65,
  totalSgst: 787.65,
  totalIgst: 0,
  totalAmount: 24502,
  allocatedAmount: 12000,
  outstandingAmount: 12502,
  notes: 'Kharif season purchase — wheat seed + fertilizers',
  cancellationReason: null,
  items: [
    { id: 'i1', productId: 'p1', productName: 'Wheat Seed HD-3385 (20kg)', unitName: 'Bag',   quantity: 5, ratePerUnit: 1800, discountPercent: 0,  discountAmount: 0,   taxableAmount: 9000,  hsnCode: '1001', taxRatePercent: 5,  cgstAmount: 225,    sgstAmount: 225,    igstAmount: 0, lineTotal: 9450 },
    { id: 'i2', productId: 'p2', productName: 'DAP Fertilizer (50kg)',      unitName: 'Bag',   quantity: 6, ratePerUnit: 1450, discountPercent: 5,  discountAmount: 435, taxableAmount: 8265,  hsnCode: '3105', taxRatePercent: 12, cgstAmount: 495.9,  sgstAmount: 495.9,  igstAmount: 0, lineTotal: 9256.8 },
    { id: 'i3', productId: 'p3', productName: 'Chlorpyriphos 20EC (1L)',    unitName: 'Litre', quantity: 5, ratePerUnit: 280,  discountPercent: 0,  discountAmount: 0,   taxableAmount: 1400,  hsnCode: '3808', taxRatePercent: 18, cgstAmount: 126,    sgstAmount: 126,    igstAmount: 0, lineTotal: 1652 },
  ],
  allocations: [
    { paymentRef: 'PMT-DEL-2026-00089', paymentDate: '15 May 2026', mode: 'Cash', allocatedAmount: 12000, isReversed: false },
  ],
};

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent, SaleItemAddComponent],
  templateUrl: './sale-detail.component.html',
  styleUrl: './sale-detail.component.scss',
})
export class SaleDetailComponent {
  readonly sale = signal<SaleDetailDto>(MOCK_SALE);
  readonly activeTab = signal<'items' | 'payments'>('items');
  readonly itemDrawerOpen = signal(false);
  readonly showConfirmDialog = signal(false);
  readonly showCancelDialog = signal(false);
  readonly cancelReason = signal('');
  readonly confirming = signal(false);
  readonly cancelling = signal(false);

  readonly statusBadge = SALE_STATUS_BADGE;
  readonly statusLabels = SALE_STATUS_LABELS;

  isDraft(): boolean { return this.sale().status === 'Draft'; }
  isConfirmed(): boolean { return this.sale().status === 'Confirmed'; }
  isInvoiced(): boolean { return this.sale().status === 'Invoiced'; }
  isPartiallyPaid(): boolean { return this.sale().status === 'PartiallyPaid'; }
  isPaid(): boolean { return this.sale().status === 'Paid'; }
  isCancelled(): boolean { return this.sale().status === 'Cancelled'; }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  fmt(n: number): string { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  fmtInr(n: number): string { return `₹${n.toLocaleString('en-IN')}`; }

  badgeVariant(s: SaleStatus): string { return SALE_STATUS_BADGE[s]; }
}
