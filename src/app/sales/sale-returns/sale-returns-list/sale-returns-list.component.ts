import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { PaginatedResponse } from '@app/models/pagination.model';
import { PagedListBase } from '@app/utils/paged-list-base';
import { SaleReturnSummaryRow, SaleReturnStatus } from '@models/sale.model';

const RETURN_STATUS_BADGE: Record<SaleReturnStatus, string> = {
  Draft: 'neutral',
  Confirmed: 'info',
  Credited: 'success',
};

const MOCK_RETURNS: SaleReturnSummaryRow[] = [
  { id: 'r001', creditNoteNumber: 'CN-DEL-2026-00012', saleRef: 'SALE-DEL-2026-00131', farmerName: 'Ramesh Kumar',  farmerCode: 'FARM-DEL-0042', returnDate: '2026-04-08', reason: 'Quality issue — discoloured seeds', totalAmount: 8850,  status: 'Credited'  },
  { id: 'r002', creditNoteNumber: 'CN-DEL-2026-00009', saleRef: 'SALE-DEL-2026-00118', farmerName: 'Sunita Poudel', farmerCode: 'FARM-DEL-0031', returnDate: '2026-03-25', reason: 'Wrong product delivered',           totalAmount: 5600,  status: 'Confirmed' },
  { id: 'r003', creditNoteNumber: 'CN-DEL-2026-00007', saleRef: 'SALE-DEL-2026-00105', farmerName: 'Arjun Rai',     farmerCode: 'FARM-DEL-0055', returnDate: '2026-03-18', reason: 'Damaged packaging',                 totalAmount: 3200,  status: 'Credited'  },
  { id: 'r004', creditNoteNumber: 'CN-DEL-2026-00005', saleRef: 'SALE-DEL-2026-00094', farmerName: 'Raju Thapa',    farmerCode: 'FARM-DEL-0072', returnDate: '2026-03-10', reason: 'Excess quantity supplied',           totalAmount: 12400, status: 'Credited'  },
  { id: 'r005', creditNoteNumber: 'CN-DEL-2026-00002', saleRef: 'SALE-DEL-2026-00081', farmerName: 'Maya Gurung',   farmerCode: 'FARM-DEL-0018', returnDate: '2026-02-28', reason: 'Customer changed mind',              totalAmount: 6750,  status: 'Draft'     },
];

@Component({
  selector: 'app-sale-returns-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent],
  templateUrl: './sale-returns-list.component.html',
  styleUrl: './sale-returns-list.component.scss',
})
export class SaleReturnsListComponent extends PagedListBase {
  private readonly router = inject(Router);

  readonly columns: GridColumn[] = [
    { field: 'creditNoteNumber', header: 'Credit Note #', sortable: false },
    { field: 'saleRef',          header: 'Original Sale', sortable: false },
    { field: 'farmerName',       header: 'Farmer',        sortable: false, displayValue: (_, r) => `${r.farmerName} · ${r.farmerCode}` },
    { field: 'returnDate',       header: 'Return Date',   sortable: false },
    { field: 'reason',           header: 'Reason',        sortable: false },
    { field: 'totalAmount',      header: 'Total (₹)',     sortable: false, displayValue: v => '₹' + (+v).toLocaleString('en-IN') },
    { field: 'status',           header: 'Status',        sortable: false, type: 'badge', badgeVariant: (_, r) => RETURN_STATUS_BADGE[r.status as SaleReturnStatus] as any },
  ];

  readonly returnsData = computed<PaginatedResponse<SaleReturnSummaryRow>>(() => {
    const q = this.query().toLowerCase();
    let filtered = MOCK_RETURNS;
    if (q) filtered = filtered.filter(r =>
      r.creditNoteNumber.toLowerCase().includes(q) ||
      r.saleRef.toLowerCase().includes(q) ||
      r.farmerName.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    );
    const total = filtered.length;
    const pg = this.pageIndex();
    const ps = this.pageSize();
    const items = filtered.slice(pg * ps, pg * ps + ps);
    return { items, totalCount: total, pageNumber: pg + 1, pageSize: ps, totalPages: Math.ceil(total / ps) || 1, hasPreviousPage: pg > 0, hasNextPage: (pg + 1) * ps < total };
  });

  onRowClick(row: SaleReturnSummaryRow): void {
    this.router.navigate(['/sales/returns', row.id]);
  }
}
