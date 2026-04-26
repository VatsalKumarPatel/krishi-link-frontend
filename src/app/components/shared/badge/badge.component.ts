import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'kl-badge',
  imports: [NgClass],
  template: `<span class="kl-badge" [ngClass]="'b-' + variant"><ng-content /></span>`,
  styles: [':host { display: contents; }'],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
}
