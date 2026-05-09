import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { AlertComponent } from '@shared/alert/alert.component';
import { ProductDto, ProductCategory, CreateProductCommand } from '@app/models/product.model';
import { MOCK_PRODUCTS } from '../products.data';

interface ProductForm {
  name: string;
  sku: string;
  category: ProductCategory;
  baseUnit: string;
  secondaryUnit: string;
  conversionFactor: number | null;
  hsn: string;
  gstRate: number;
  isActive: boolean;
}

function emptyForm(): ProductForm {
  return { name: '', sku: '', category: 'Fertilizer', baseUnit: '', secondaryUnit: '', conversionFactor: null, hsn: '', gstRate: 5, isActive: true };
}

function productToForm(p: ProductDto): ProductForm {
  return { name: p.name, sku: p.sku, category: p.category, baseUnit: p.baseUnit, secondaryUnit: p.secondaryUnit ?? '', conversionFactor: p.conversionFactor ?? null, hsn: p.hsn ?? '', gstRate: p.gstRate, isActive: p.isActive };
}

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [KlDrawerComponent, FormsModule, AlertComponent],
  templateUrl: './product-add.component.html',
})
export class ProductAddComponent extends KlDrawerFormHost implements OnChanges {
  @Input() productId: string | null = null;

  form: ProductForm = emptyForm();
  saving = false;
  saveError: string | null = null;

  readonly categories: ProductCategory[] = ['Fertilizer', 'Pesticide', 'Seed', 'Equipment', 'Other'];
  readonly gstRates = [0, 5, 12, 18, 28];

  protected get entityId(): string | null { return this.productId; }
  protected get entityIdInputName(): string { return 'productId'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    this.saveError = null;
    if (this.open && this.productId) {
      const found = MOCK_PRODUCTS.find(p => p.id === this.productId);
      this.form = found ? productToForm(found) : emptyForm();
    } else if (this.open) {
      this.form = emptyForm();
    }
  }

  submit(): void {
    if (this.saving) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.notifySaved();
    }, 600);
  }
}
