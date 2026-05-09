import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';

interface ItemForm {
  productName: string;
  unitName: string;
  quantity: number;
  ratePerUnit: number;
  discountPercent: number;
  hsnCode: string;
  taxRatePercent: number;
}

interface AddedItem {
  productName: string;
  quantity: number;
  lineTotal: number;
}

function emptyForm(): ItemForm {
  return { productName: '', unitName: 'Bag', quantity: 1, ratePerUnit: 0, discountPercent: 0, hsnCode: '', taxRatePercent: 12 };
}

@Component({
  selector: 'app-sale-item-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './sale-item-add.component.html',
  styles: [':host { display: contents; }'],
})
export class SaleItemAddComponent extends KlDrawerFormHost {
  @Input() saleId: string | null = null;

  form: ItemForm = emptyForm();
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly addedItems = signal<AddedItem[]>([]);

  readonly gstRates = [0, 5, 12, 18, 28];
  readonly units = ['Bag', 'Kg', 'Litre', 'Packet', 'Bottle', 'Box', 'Unit'];

  protected get entityId(): string | null { return this.saleId; }
  protected get entityIdInputName(): string { return 'saleId'; }

  get title(): string { return 'Add Line Item'; }
  get subtitle(): string { return 'Add a product to this sale'; }

  get lineTotal(): number {
    const gross = this.form.quantity * this.form.ratePerUnit;
    const taxable = gross * (1 - this.form.discountPercent / 100);
    return +(taxable * (1 + this.form.taxRatePercent / 100)).toFixed(2);
  }

  override onDrawerStateChange(_changes: SimpleChanges): void {
    if (!this.open) {
      this.form = emptyForm();
      this.error.set(null);
    }
  }

  submit(): void {
    if (!this.form.productName.trim()) { this.error.set('Product name is required.'); return; }
    if (this.form.quantity <= 0) { this.error.set('Quantity must be positive.'); return; }
    if (this.form.ratePerUnit <= 0) { this.error.set('Rate must be positive.'); return; }

    this.saving.set(true);
    this.error.set(null);
    setTimeout(() => {
      this.addedItems.update(list => [{ productName: this.form.productName, quantity: this.form.quantity, lineTotal: this.lineTotal }, ...list]);
      this.form = emptyForm();
      this.saving.set(false);
      this.notifySaved();
    }, 400);
  }

  fmt(n: number): string { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}
