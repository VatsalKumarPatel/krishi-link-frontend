import { Component, Input } from '@angular/core';
import { KlDrawerComponent } from '../../../components/shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '../../../components/shared/kl-drawer/kl-drawer-form-host';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'app-payment-add',
  standalone: true,
  imports: [KlDrawerComponent, PaymentFormComponent],
  templateUrl: './payment-add.component.html',
  styles: [':host { display: contents; }'],
})
export class PaymentAddComponent extends KlDrawerFormHost {
  @Input() paymentId: string | null = null;

  get title(): string { return this.isEdit ? 'Edit Payment' : 'Record Payment'; }
  get subtitle(): string {
    return this.isEdit ? `ID ${this.shortId()}` : 'Record a new supplier payment.';
  }

  protected get entityId(): string | null { return this.paymentId; }
  protected get entityIdInputName(): string { return 'paymentId'; }
}
