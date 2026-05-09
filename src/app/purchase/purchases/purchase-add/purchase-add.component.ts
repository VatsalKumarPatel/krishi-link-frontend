import { Component, Input } from '@angular/core';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';

@Component({
  selector: 'app-purchase-add',
  standalone: true,
  imports: [KlDrawerComponent, PurchaseFormComponent],
  templateUrl: './purchase-add.component.html',
  styles: [':host { display: contents; }'],
})
export class PurchaseAddComponent extends KlDrawerFormHost {
  @Input() purchaseId: string | null = null;

  get title(): string { return this.isEdit ? 'Edit Purchase' : 'New Purchase'; }
  get subtitle(): string {
    return this.isEdit ? `ID ${this.shortId()}` : 'Create a new purchase order.';
  }

  protected get entityId(): string | null { return this.purchaseId; }
  protected get entityIdInputName(): string { return 'purchaseId'; }
}
