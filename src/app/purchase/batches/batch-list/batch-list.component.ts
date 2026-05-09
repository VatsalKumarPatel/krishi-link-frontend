import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { BatchService } from '@services/batch.service';
import { BatchDto } from '@models/batch.model';
import { PaginatedResponse, createEmptyPaginatedResponse, toPagedResponse } from '@app/models/pagination.model';
import { formatNumber } from '@app/utils/format';
import { PagedListBase } from '@app/utils/paged-list-base';

type BatchRow = BatchDto & { statusLabel: string; quantityFmt: string; costFmt: string };

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
export class BatchListComponent extends PagedListBase {
  private readonly batchService = inject(BatchService);
  private readonly router = inject(Router);

  showExpired = signal(false);
  showDepleted = signal(false);

  readonly columns: GridColumn[] = [
    { field: 'batchNumber', header: 'Batch #', sortable: false },
    { field: 'productName', header: 'Product', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'expiryDate', header: 'Expiry Date', type: 'date', sortable: false },
    { field: 'quantityFmt', header: 'Available Qty', sortable: false },
    { field: 'costFmt', header: 'Cost (â‚¹)', sortable: false },
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
        map(r => toPagedResponse(r, b => ({
          ...b,
          statusLabel: batchStatusLabel(b),
          quantityFmt: formatNumber(b.quantityAvailableInBase),
          costFmt: `â‚¹${formatNumber(b.costPricePerUnit)}`,
        })))
      ),
  });

  batches = computed(() => this.batchesResource.value() ?? createEmptyPaginatedResponse<BatchRow>());

  toggleExpired(checked: boolean): void { this.filterSet(this.showExpired, checked); }
  toggleDepleted(checked: boolean): void { this.filterSet(this.showDepleted, checked); }

  onRowClick(row: BatchRow): void {
    this.router.navigate(['/purchase/batches', row.id]);
  }
}
