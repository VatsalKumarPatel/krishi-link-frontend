import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { KlGridComponent } from '@app/components/shared/kl-grid/kl-grid.component';
import { GridColumn } from '@app/components/shared/kl-grid/kl-grid.types';
import { PurchaseReturnService } from '@services/purchase-return.service';
import {
  PurchaseReturnSummaryDto,
  PurchaseReturnStatus,
  RETURN_STATUS_LABELS,
} from '@models/purchase-return.model';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';

type ReturnRow = PurchaseReturnSummaryDto & { statusLabel: string; totalAmountFmt: string };

function returnStatusVariant(s: PurchaseReturnStatus): 'neutral' | 'warning' | 'success' {
  if (s === PurchaseReturnStatus.Draft) return 'neutral';
  if (s === PurchaseReturnStatus.Dispatched) return 'warning';
  return 'success';
}

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

@Component({
  selector: 'app-return-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent],
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.scss'],
})
export class ReturnListComponent {
  private readonly returnService = inject(PurchaseReturnService);
  private readonly router = inject(Router);

  pageIndex = signal(0);
  pageSize = signal(20);

  readonly columns: GridColumn[] = [
    { field: 'debitNoteNumber', header: 'Debit Note #', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'storeName', header: 'Store', sortable: false },
    { field: 'purchaseRef', header: 'Original Purchase', sortable: false },
    { field: 'returnDate', header: 'Return Date', type: 'date', sortable: false },
    { field: 'totalAmountFmt', header: 'Total (₹)', sortable: false },
    { field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v, row: ReturnRow) => returnStatusVariant(row.status) },
  ];

  private readonly queryParams = computed(() => ({
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
  }));

  returnsResource = rxResource<PaginatedResponse<ReturnRow>, ReturnType<ReturnListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) =>
      this.returnService.getAll(params.pageIndex + 1, params.pageSize).pipe(
        map(r => ({
          items: r.items.map(x => ({
            ...x,
            statusLabel: RETURN_STATUS_LABELS[x.status],
            totalAmountFmt: `₹${fmt(x.totalAmount)}`,
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

  returns = computed(() => this.returnsResource.value() ?? createEmptyPaginatedResponse<ReturnRow>());

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  onRowClick(row: ReturnRow): void {
    this.router.navigate(['/purchase/purchase-returns', row.id]);
  }
}
