import { Component, Input } from '@angular/core';

@Component({
  selector: 'kl-empty-state',
  standalone: true,
  template: `
    <div style="padding:48px 20px; text-align:center; color:#6B7A6E;">
      <ng-content select="[icon]" />
      <div style="font-family:'Fraunces',serif; font-weight:600; font-size:14px; color:#445245; margin-bottom:4px;">{{ title }}</div>
      <div style="font-size:13px;">{{ message }}</div>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class KlEmptyStateComponent {
  @Input() title = 'No items yet';
  @Input() message = '';
}
