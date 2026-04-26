import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  readonly product = {
    id: '1', sku: 'KL-S001', name: 'Hybrid Rice Seed', category: 'Seeds',
    unit: 'kg', price: 850, stock: 420, minStock: 100, maxStock: 600,
    description: 'High-yield hybrid rice variety suitable for irrigated lowlands. Kharif season recommended.',
  };
  readonly id: string;

  constructor(route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id') ?? '1';
  }
}
