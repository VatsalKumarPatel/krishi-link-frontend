import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { KlDrawerComponent } from '../../../components/shared/kl-drawer/kl-drawer.component';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';

@Component({
  selector: 'app-purchase-add',
  standalone: true,
  imports: [KlDrawerComponent, PurchaseFormComponent],
  templateUrl: './purchase-add.component.html',
  styles: [':host { display: contents; }'],
})
export class PurchaseAddComponent implements OnChanges {
  @Input() open = false;
  @Input() purchaseId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isEdit = false;

  get title(): string { return this.isEdit ? 'Edit Purchase' : 'New Purchase'; }
  get subtitle(): string {
    return this.isEdit ? `ID ${(this.purchaseId ?? '').slice(0, 8)}…` : 'Create a new purchase order.';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['purchaseId']) {
      this.isEdit = !!(this.open && this.purchaseId);
    }
  }
}
