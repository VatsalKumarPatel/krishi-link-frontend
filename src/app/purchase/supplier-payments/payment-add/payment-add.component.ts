import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { KlDrawerComponent } from '../../../components/shared/kl-drawer/kl-drawer.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'app-payment-add',
  standalone: true,
  imports: [KlDrawerComponent, PaymentFormComponent],
  templateUrl: './payment-add.component.html',
  styles: [':host { display: contents; }'],
})
export class PaymentAddComponent implements OnChanges {
  @Input() open = false;
  @Input() paymentId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isEdit = false;

  get title(): string { return this.isEdit ? 'Edit Payment' : 'Record Payment'; }
  get subtitle(): string {
    return this.isEdit ? `ID ${(this.paymentId ?? '').slice(0, 8)}…` : 'Record a new supplier payment.';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['paymentId']) {
      this.isEdit = !!(this.open && this.paymentId);
    }
  }
}
