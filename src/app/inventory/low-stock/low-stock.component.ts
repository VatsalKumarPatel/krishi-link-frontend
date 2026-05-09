import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { MOCK_LOW_STOCK } from '../inventory.data';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './low-stock.component.html',
  styleUrl: './low-stock.component.scss',
})
export class LowStockComponent {
  readonly items = MOCK_LOW_STOCK;
  readonly outCount = this.items.filter(i => i.currentStock === 0).length;
  readonly lowCount = this.items.filter(i => i.currentStock > 0).length;
}
