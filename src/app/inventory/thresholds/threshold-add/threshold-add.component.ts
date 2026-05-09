import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { MOCK_PRODUCTS } from '@app/products/products.data';
import { MOCK_THRESHOLDS } from '../../inventory.data';

interface ThresholdForm {
  storeId: string;
  productId: string;
  reorderLevel: number | null;
  reorderQty: number | null;
  preferredSupplierName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-threshold-add',
  standalone: true,
  imports: [KlDrawerComponent, FormsModule],
  templateUrl: './threshold-add.component.html',
})
export class ThresholdAddComponent extends KlDrawerFormHost implements OnChanges {
  @Input() thresholdId: string | null = null;

  readonly stores = [
    { id: 's1', name: 'Nagpur Main' },
    { id: 's2', name: 'Wardha Hub' },
    { id: 's3', name: 'Amravati Point' },
  ];
  readonly products = MOCK_PRODUCTS;

  form: ThresholdForm = this.emptyForm();
  saving = false;

  protected get entityId(): string | null { return this.thresholdId; }
  protected get entityIdInputName(): string { return 'thresholdId'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    if (this.open && this.thresholdId) {
      const found = MOCK_THRESHOLDS.find(t => t.id === this.thresholdId);
      this.form = found
        ? { storeId: found.storeId, productId: found.productId, reorderLevel: found.reorderLevel, reorderQty: found.reorderQty ?? null, preferredSupplierName: found.preferredSupplierName ?? '', isActive: found.isActive }
        : this.emptyForm();
    } else if (this.open) {
      this.form = this.emptyForm();
    }
  }

  private emptyForm(): ThresholdForm {
    return { storeId: 's1', productId: 'p1', reorderLevel: null, reorderQty: null, preferredSupplierName: '', isActive: true };
  }

  submit(): void {
    if (this.saving) return;
    this.saving = true;
    setTimeout(() => { this.saving = false; this.notifySaved(); }, 500);
  }
}
