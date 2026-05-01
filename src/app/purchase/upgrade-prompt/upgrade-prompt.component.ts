import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upgrade-prompt',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; text-align:center; padding:40px;">
      <div style="width:64px; height:64px; background:#FEF3C7; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#92400E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h2 style="font-family:'Fraunces',serif; font-size:24px; color:#1A2B1C; margin:0 0 8px;">Premium Feature</h2>
      <p style="color:#6B7A6E; font-size:14px; max-width:360px; margin:0 0 24px; line-height:1.6;">
        Batch &amp; expiry tracking, stock valuation and other advanced features are available on the <strong>Premium</strong> plan.
      </p>
      <a routerLink="/settings" class="kl-btn kl-btn-primary" style="font-size:14px;">
        Upgrade to Premium →
      </a>
      <a routerLink="/purchase/purchases" class="kl-link" style="margin-top:16px; font-size:13px; color:#6B7A6E;">
        ← Go back to Purchases
      </a>
    </div>
  `,
})
export class UpgradePromptComponent {}
