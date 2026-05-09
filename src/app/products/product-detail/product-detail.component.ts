import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { BadgeVariant } from '@shared/badge/badge.component';
import { ProductAddComponent } from '../product-add/product-add.component';
import { MOCK_PRODUCTS } from '../products.data';
import { MOCK_STOCK, MOCK_LEDGER_ENTRIES } from '@app/inventory/inventory.data';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent, ProductAddComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly editOpen = signal(false);

  readonly productId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly product = MOCK_PRODUCTS.find(p => p.id === this.productId) ?? null;

  readonly stockByStore = MOCK_STOCK.filter(s => s.productId === this.productId);
  readonly ledger = MOCK_LEDGER_ENTRIES.slice(0, 10);

  stockVariant(status: string): BadgeVariant {
    if (status === 'out') return 'danger';
    if (status === 'low') return 'warning';
    return 'success';
  }

  stockLabel(status: string): string {
    if (status === 'out') return 'Out of stock';
    if (status === 'low') return 'Low';
    return 'OK';
  }

  ledgerVariant(entryType: string): BadgeVariant {
    if (entryType.includes('Out') || entryType.includes('Down') || entryType === 'SaleIssue' || entryType === 'Damage') return 'danger';
    if (entryType.includes('In') || entryType.includes('Up') || entryType === 'PurchaseReceive') return 'success';
    return 'neutral';
  }

  openEdit(): void { this.editOpen.set(true); }
  closeEdit(): void { this.editOpen.set(false); }
}
