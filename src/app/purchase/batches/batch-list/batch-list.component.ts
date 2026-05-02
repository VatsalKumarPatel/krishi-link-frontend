import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '../../../components/shared/badge/badge.component';
import { BatchService } from '@services/batch.service';
import { BatchDto } from '@models/batch.model';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';

type BatchRow = BatchDto & { statusLabel: string; quantityFmt: string; costFmt: string };

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

function batchStatusVariant(b: BatchDto): BadgeVariant {
  if (!b.isActive) return 'neutral';
  const exp = new Date(b.expiryDate);
  const now = new Date();
  if (exp < now) return 'danger';
  const soon = new Date(); soon.setDate(soon.getDate() + 30);
  if (exp <= soon) return 'warning';
  return 'success';
}

function batchStatusLabel(b: BatchDto): string {
  if (!b.isActive) return 'Depleted';
  const exp = new Date(b.expiryDate);
  const now = new Date();
  if (exp < now) return 'Expired';
  const soon = new Date(); soon.setDate(soon.getDate() + 30);
  if (exp <= soon) return 'Expiring Soon';
  return 'Active';
}

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent],
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
})
export class BatchListComponent {
  private readonly batchService = inject(BatchService);
  private readonly router = inject(Router);

  showExpired = signal(false);
  showDepleted = signal(false);
  pageIndex = signal(0);
  pageSize = signal(20);

  readonly columns: GridColumn[] = [
    { field: 'batchNumber', header: 'Batch #', sortable: false },
    { field: 'productName', header: 'Product', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'expiryDate', header: 'Expiry Date', type: 'date', sortable: false },
    { field: 'quantityFmt', header: 'Available Qty', sortable: false },
    { field: 'costFmt', header: 'Cost (₹)', sortable: false },
    { field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v, row: BatchRow) => batchStatusVariant(row) },
  ];

  private readonly queryParams = computed(() => ({
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    showExpired: this.showExpired(),
    showDepleted: this.showDepleted(),
  }));

  batchesResource = rxResource<PaginatedResponse<BatchRow>, ReturnType<BatchListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) =>
      this.batchService.getAll(params.pageIndex + 1, params.pageSize, params.showExpired, params.showDepleted).pipe(
        map(r => ({
          items: r.items.map(b => ({
            ...b,
            statusLabel: batchStatusLabel(b),
            quantityFmt: fmt(b.quantityAvailableInBase),
            costFmt: `₹${fmt(b.costPricePerUnit)}`,
          })),
          totalCount: r.totalCount,
          pageNumber: r.page,
          pageSize: r.pageSize,
          totalPages: r.totalPages,
          hasPreviousPage: r.hasPreviousPage,
          hasNextPage: r.hasNextPage,
        }))
      ),
  });

  batches = computed(() => this.batchesResource.value() ?? createEmptyPaginatedResponse<BatchRow>());

  toggleExpired(checked: boolean): void {
    this.showExpired.set(checked);
    this.pageIndex.set(0);
  }

  toggleDepleted(checked: boolean): void {
    this.showDepleted.set(checked);
    this.pageIndex.set(0);
  }

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  onRowClick(row: BatchRow): void {
    this.router.navigate(['/purchase/batches', row.id]);
  }
}
