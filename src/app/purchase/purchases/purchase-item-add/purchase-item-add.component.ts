import { Component, DestroyRef, Input, SimpleChanges, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { PurchaseService } from '@services/purchase.service';
import { ToastService } from '@services/toast.service';
import { AddPurchaseItemCommand, PurchaseItemDto } from '@models/purchase.model';
import { formatNumber } from '@app/utils/format';

const GST_RATES = [0, 5, 12, 18, 28];

interface ItemForm {
  productId: string;
  unitId: string;
  quantity: number;
  ratePerUnit: number;
  discountPercent: number;
  hsnCode: string;
  taxRatePercent: number;
  batchNumber: string;
  expiryDate: string;
}

function emptyForm(): ItemForm {
  return {
    productId: '',
    unitId: '',
    quantity: 1,
    ratePerUnit: 0,
    discountPercent: 0,
    hsnCode: '',
    taxRatePercent: 5,
    batchNumber: '',
    expiryDate: '',
  };
}

@Component({
  selector: 'app-purchase-item-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './purchase-item-add.component.html',
  styles: [':host { display: contents; }'],
})
export class PurchaseItemAddComponent extends KlDrawerFormHost {
  @Input() purchaseId: string | null = null;

  private readonly purchaseService = inject(PurchaseService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly gstRates = GST_RATES;

  form = emptyForm();
  saving = signal(false);
  error = signal<string | null>(null);
  addedItems = signal<PurchaseItemDto[]>([]);

  get title(): string { return 'Add Line Item'; }
  get subtitle(): string { return `${this.addedItems().length} item(s) added this session`; }

  protected get entityId(): string | null { return this.purchaseId; }
  protected get entityIdInputName(): string { return 'purchaseId'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    if (this.open) {
      this.form = emptyForm();
      this.error.set(null);
      this.saving.set(false);
      this.addedItems.set([]);
    }
  }

  get lineTotal(): number {
    const gross = this.form.quantity * this.form.ratePerUnit;
    const taxable = gross * (1 - this.form.discountPercent / 100);
    return +(taxable * (1 + this.form.taxRatePercent / 100)).toFixed(2);
  }

  submit(): void {
    if (this.saving() || !this.purchaseId) return;

    this.error.set(null);
    if (!this.form.productId.trim()) { this.error.set('Product ID is required.'); return; }
    if (!this.form.unitId.trim())    { this.error.set('Unit ID is required.');    return; }
    if (this.form.quantity <= 0)     { this.error.set('Quantity must be greater than 0.'); return; }

    const cmd: AddPurchaseItemCommand = {
      productId:      this.form.productId.trim(),
      unitId:         this.form.unitId.trim(),
      quantity:       this.form.quantity,
      ratePerUnit:    this.form.ratePerUnit,
      discountPercent: this.form.discountPercent,
      hsnCode:        this.form.hsnCode.trim(),
      taxRatePercent: this.form.taxRatePercent,
      batchNumber:    this.form.batchNumber.trim() || null,
      expiryDate:     this.form.expiryDate || null,
    };

    this.saving.set(true);
    this.purchaseService.addItem(this.purchaseId, cmd)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (item) => {
          this.saving.set(false);
          this.addedItems.update(list => [item, ...list]);
          this.toast.success(`${item.productName} added.`);
          this.form = emptyForm();
          this.notifySaved();
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.detail ?? 'Failed to add item.');
        },
      });
  }

  fmt(n: number): string { return formatNumber(n); }
}
