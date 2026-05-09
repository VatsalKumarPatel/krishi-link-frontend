import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { ReturnAddComponent } from '../return-add/return-add.component';
import { PurchaseReturnService } from '@services/purchase-return.service';
import {
  PurchaseReturnSummaryDto,
  PurchaseReturnStatus,
  RETURN_STATUS_LABELS,
} from '@models/purchase-return.model';
import { PaginatedResponse, createEmptyPaginatedResponse, toPagedResponse } from '@app/models/pagination.model';
import { formatMoneyWithSymbol } from '@app/utils/format';
import { PagedListBase } from '@app/utils/paged-list-base';

type ReturnRow = PurchaseReturnSummaryDto & { statusLabel: string; totalAmountFmt: string };

function returnStatusVariant(s: PurchaseReturnStatus): 'neutral' | 'warning' | 'success' {
  if (s === PurchaseReturnStatus.Draft) return 'neutral';
  if (s === PurchaseReturnStatus.Dispatched) return 'warning';
  return 'success';
}

@Component({
  selector: 'app-return-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, ReturnAddComponent],
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.scss'],
})
export class ReturnListComponent extends PagedListBase {
  private readonly returnService = inject(PurchaseReturnService);
  private readonly router = inject(Router);

  readonly columns: GridColumn[] = [
    { field: 'debitNoteNumber', header: 'Debit Note #', sortable: false },
    { field: 'supplierName', header: 'Supplier', sortable: false },
    { field: 'storeName', header: 'Store', sortable: false },
    { field: 'purchaseRef', header: 'Original Purchase', sortable: false },
    { field: 'returnDate', header: 'Return Date', type: 'date', sortable: false },
    { field: 'totalAmountFmt', header: 'Total (â‚¹)', sortable: false },
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
        map(r => toPagedResponse(r, x => ({
          ...x,
          statusLabel: RETURN_STATUS_LABELS[x.status],
          totalAmountFmt: formatMoneyWithSymbol(x.totalAmount),
        })))
      ),
  });

  returns = computed(() => this.returnsResource.value() ?? createEmptyPaginatedResponse<ReturnRow>());

  onRowClick(row: ReturnRow): void {
    this.router.navigate(['/purchase/purchase-returns', row.id]);
  }

  onDrawerSaved(): void {
    this.closeDrawerAndReload(this.returnsResource);
  }
}
