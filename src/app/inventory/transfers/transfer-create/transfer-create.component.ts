import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { AlertComponent } from '@shared/alert/alert.component';
import { MOCK_PRODUCTS } from '@app/products/products.data';

interface TransferItem { productId: string; productName: string; unit: string; quantity: number | null; }

@Component({
  selector: 'app-transfer-create',
  standalone: true,
  imports: [RouterLink, KlCardComponent, FormsModule, AlertComponent],
  templateUrl: './transfer-create.component.html',
  styleUrl: './transfer-create.component.scss',
})
export class TransferCreateComponent {
  private readonly router = inject(Router);

  readonly stores = [
    { id: 's1', name: 'Nagpur Main' },
    { id: 's2', name: 'Wardha Hub' },
    { id: 's3', name: 'Amravati Point' },
  ];
  readonly products = MOCK_PRODUCTS;

  readonly step = signal(1);
  readonly fromStoreId = signal('s1');
  readonly toStoreId = signal('s2');
  readonly items = signal<TransferItem[]>([]);
  readonly notes = signal('');
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);

  get sameStoreError(): boolean {
    return this.fromStoreId() === this.toStoreId();
  }

  addItem(): void {
    const p = this.products[0];
    this.items.update(list => [...list, { productId: p.id, productName: p.name, unit: p.baseUnit, quantity: null }]);
  }

  removeItem(index: number): void {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  updateItem(index: number, productId: string): void {
    const p = this.products.find(pr => pr.id === productId);
    if (!p) return;
    this.items.update(list => list.map((item, i) => i === index ? { ...item, productId, productName: p.name, unit: p.baseUnit } : item));
  }

  updateQty(index: number, qty: number): void {
    this.items.update(list => list.map((item, i) => i === index ? { ...item, quantity: qty } : item));
  }

  nextStep(): void {
    this.error.set(null);
    if (this.sameStoreError) { this.error.set('Source and destination store cannot be the same.'); return; }
    this.step.set(2);
    if (this.items().length === 0) this.addItem();
  }

  prevStep(): void { this.step.set(this.step() - 1); }

  submit(): void {
    const validItems = this.items().filter(i => i.quantity && i.quantity > 0);
    if (validItems.length === 0) { this.error.set('Add at least one item with a valid quantity.'); return; }
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.router.navigate(['/inventory/transfers']);
    }, 800);
  }
}
