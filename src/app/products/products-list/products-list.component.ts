import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { PagedListBase } from '@app/utils/paged-list-base';
import { ProductDto, ProductCategory } from '@app/models/product.model';
import { MOCK_PRODUCTS } from '../products.data';
import { ProductAddComponent } from '../product-add/product-add.component';
import { PaginatedResponse } from '@app/models/pagination.model';

interface ProductRow extends ProductDto {
  statusLabel: string;
  gstLabel: string;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, ProductAddComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent extends PagedListBase {
  private readonly router = inject(Router);

  readonly categoryFilter = signal<ProductCategory | undefined>(undefined);
  readonly categories: (ProductCategory | undefined)[] = [undefined, 'Fertilizer', 'Pesticide', 'Seed', 'Equipment', 'Other'];

  readonly columns: GridColumn[] = [
    { field: 'name',        header: 'Product',  sortable: true },
    { field: 'sku',         header: 'SKU',       sortable: false },
    { field: 'category',    header: 'Category',  sortable: true },
    { field: 'baseUnit',    header: 'Base Unit', sortable: false },
    { field: 'gstLabel',    header: 'GST',       sortable: false },
    {
      field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: ProductRow): BadgeVariant => row.isActive ? 'success' : 'neutral',
    },
  ];

  private readonly allRows = computed<ProductRow[]>(() =>
    MOCK_PRODUCTS.map(p => ({
      ...p,
      statusLabel: p.isActive ? 'Active' : 'Inactive',
      gstLabel: p.gstRate === 0 ? 'Exempt' : `${p.gstRate}%`,
    }))
  );

  readonly filteredData = computed<PaginatedResponse<ProductRow>>(() => {
    const q = this.query().toLowerCase();
    const cat = this.categoryFilter();
    let items = this.allRows();
    if (cat) items = items.filter(p => p.category === cat);
    if (q)   items = items.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    const start = this.pageIndex() * this.pageSize();
    const ps = this.pageSize();
    const total = items.length;
    const totalPages = Math.ceil(total / ps) || 1;
    const page = this.pageIndex() + 1;
    return { items: items.slice(start, start + ps), totalCount: total, pageNumber: page, pageSize: ps, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
  });

  setCategory(cat: ProductCategory | undefined): void {
    this.filterSet(this.categoryFilter, cat);
  }

  onRowClick(row: ProductRow): void {
    this.router.navigate(['/products', row.id]);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
