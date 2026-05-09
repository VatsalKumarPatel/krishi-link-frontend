import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'kl-detail-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="kl-page-header" style="align-items:center; gap:12px;">
      <div style="display:flex; align-items:center; gap:10px; min-width:0;">
        <a [routerLink]="backLink" class="kl-btn kl-btn-secondary" style="padding:6px 10px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </a>
        <div class="kl-crumbs" style="margin:0;">
          <ng-content select="[breadcrumbs]" />
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class KlDetailHeaderComponent {
  @Input() backLink: string | string[] = '..';
}
