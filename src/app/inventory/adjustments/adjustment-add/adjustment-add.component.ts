import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { AlertComponent } from '@shared/alert/alert.component';
import { AdjustmentType } from '@app/models/inventory.model';
import { MOCK_PRODUCTS } from '@app/products/products.data';
import { MOCK_STOCK } from '../../inventory.data';

interface AdjForm {
  storeId: string;
  productId: string;
  adjustmentType: AdjustmentType;
  physicalQty: number | null;
  reason: string;
}

@Component({
  selector: 'app-adjustment-add',
  standalone: true,
  imports: [KlDrawerComponent, FormsModule, AlertComponent],
  templateUrl: './adjustment-add.component.html',
})
export class AdjustmentAddComponent extends KlDrawerFormHost {
  @Input() adjustmentId: string | null = null;

  readonly stores = [
    { id: 's1', name: 'Nagpur Main' },
    { id: 's2', name: 'Wardha Hub' },
    { id: 's3', name: 'Amravati Point' },
  ];
  readonly products = MOCK_PRODUCTS;
  readonly adjustmentTypes: { value: AdjustmentType; label: string }[] = [
    { value: 'ManualCorrection', label: 'Manual Correction' },
    { value: 'PhysicalCount', label: 'Physical Count' },
    { value: 'Damage', label: 'Damage / Write-off' },
  ];

  form: AdjForm = this.emptyForm();
  saving = false;
  saveError: string | null = null;

  protected get entityId(): string | null { return this.adjustmentId; }
  protected get entityIdInputName(): string { return 'adjustmentId'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    this.saveError = null;
    if (this.open) this.form = this.emptyForm();
  }

  private emptyForm(): AdjForm {
    return { storeId: 's1', productId: 'p1', adjustmentType: 'ManualCorrection', physicalQty: null, reason: '' };
  }

  get systemQty(): number {
    const match = MOCK_STOCK.find(s => s.storeId === this.form.storeId && s.productId === this.form.productId);
    return match?.quantityInBase ?? 0;
  }

  get systemUnit(): string {
    const match = MOCK_STOCK.find(s => s.storeId === this.form.storeId && s.productId === this.form.productId);
    return match?.baseUnit ?? 'units';
  }

  get difference(): number {
    if (this.form.physicalQty == null) return 0;
    return this.form.physicalQty - this.systemQty;
  }

  get reasonRequired(): boolean { return this.form.adjustmentType === 'Damage'; }

  get canSubmit(): boolean {
    if (this.form.physicalQty == null || this.form.physicalQty < 0) return false;
    if (this.reasonRequired && !this.form.reason.trim()) return false;
    return true;
  }

  submit(): void {
    if (this.saving || !this.canSubmit) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.notifySaved();
    }, 600);
  }
}
