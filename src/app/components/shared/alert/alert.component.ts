import { Component, Input, signal } from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'kl-alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
  styles: [':host { display: contents; }'],
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() message = '';
  visible = signal(true);
}
