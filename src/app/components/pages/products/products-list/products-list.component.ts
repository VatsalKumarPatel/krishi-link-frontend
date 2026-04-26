import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';

interface Product {
  id: string; sku: string; name: string; category: string;
  stock: number; minStock: number; price: number; unit: string;
}

@Component({
  selector: 'app-products-list',
  imports: [RouterLink, FormsModule, KlCardComponent, BadgeComponent, DecimalPipe],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  search = signal('');
  categoryFilter = signal('All');
  openFilter = signal<string | null>(null);

  readonly categories = ['All', 'Seeds', 'Fertilizers', 'Tools'];

  readonly products: Product[] = [
    { id: '1', sku: 'KL-S001', name: 'Hybrid Rice Seed',       category: 'Seeds',       stock: 420,  minStock: 100, price: 850,  unit: 'kg' },
    { id: '2', sku: 'KL-F002', name: 'NPK Fertilizer 20-20-0', category: 'Fertilizers', stock: 85,   minStock: 200, price: 1200, unit: 'bag' },
    { id: '3', sku: 'KL-S003', name: 'Maize Seed BH-540',      category: 'Seeds',       stock: 310,  minStock: 50,  price: 620,  unit: 'kg' },
    { id: '4', sku: 'KL-P004', name: 'Hand Sprayer 16L',       category: 'Tools',       stock: 44,   minStock: 20,  price: 1750, unit: 'piece' },
    { id: '5', sku: 'KL-F005', name: 'Urea 46%',               category: 'Fertilizers', stock: 12,   minStock: 150, price: 980,  unit: 'bag' },
    { id: '6', sku: 'KL-S006', name: 'Wheat Seed HD-2967',     category: 'Seeds',       stock: 560,  minStock: 100, price: 480,  unit: 'kg' },
    { id: '7', sku: 'KL-T007', name: 'Soil Test Kit',          category: 'Tools',       stock: 8,    minStock: 15,  price: 3200, unit: 'piece' },
    { id: '8', sku: 'KL-F008', name: 'DAP Fertilizer',         category: 'Fertilizers', stock: 230,  minStock: 100, price: 1450, unit: 'bag' },
  ];

  get filtered() {
    const q = this.search().toLowerCase();
    const cat = this.categoryFilter();
    return this.products.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = cat === 'All' || p.category === cat;
      return matchSearch && matchCat;
    });
  }

  toggleFilter(name: string) {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  setCategory(cat: string) {
    this.categoryFilter.set(cat);
    this.openFilter.set(null);
  }

  stockVariant(p: Product): 'danger' | 'warning' | 'neutral' {
    if (p.stock < p.minStock) return 'danger';
    if (p.stock < p.minStock * 1.5) return 'warning';
    return 'neutral';
  }
}
