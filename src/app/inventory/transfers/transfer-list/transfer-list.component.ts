import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { BadgeVariant } from '@shared/badge/badge.component';
import { PagedListBase } from '@app/utils/paged-list-base';
import { TransferStatus, StockTransferDto } from '@app/models/inventory.model';
import { MOCK_TRANSFERS } from '../../inventory.data';
import { PaginatedResponse } from '@app/models/pagination.model';

type StatusTab = 'all' | 'PendingApproval' | 'InTransit' | 'Received' | 'Cancelled';

interface TransferRow extends StockTransferDto {
  itemCount: number;
  statusLabel: string;
}

@Component({
  selector: 'app-transfer-list',
  standalone: true,
  imports: [RouterLink, KlCardComponent, KlGridComponent],
  templateUrl: './transfer-list.component.html',
  styleUrl: './transfer-list.component.scss',
})
export class TransferListComponent extends PagedListBase {
  private readonly router = inject(Router);
  readonly statusTab = signal<StatusTab>('all');

  readonly columns: GridColumn[] = [
    { field: 'id',            header: 'Transfer ID', sortable: false, displayValue: (v: string) => v.replace('tr-', 'TR-') },
    { field: 'fromStoreName', header: 'From',         sortable: true },
    { field: 'toStoreName',   header: 'To',           sortable: true },
    { field: 'itemCount',     header: 'Items',        sortable: false },
    { field: 'createdBy',     header: 'Created by',   sortable: false },
    { field: 'createdAt',     header: 'Date',          type: 'date', sortable: true, dateFormat: 'dd MMM yyyy' },
    {
      field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: TransferRow): BadgeVariant => {
        const s = row.status;
        if (s === 'Received') return 'success';
        if (s === 'Cancelled') return 'danger';
        if (s === 'PendingApproval' || s === 'PartiallyReceived') return 'warning';
        if (s === 'InTransit' || s === 'Approved') return 'info';
        return 'neutral';
      },
    },
  ];

  private readonly statusLabelMap: Record<TransferStatus, string> = {
    Draft: 'Draft', PendingApproval: 'Pending Approval', Approved: 'Approved',
    InTransit: 'In Transit', PartiallyReceived: 'Partial', Received: 'Received', Cancelled: 'Cancelled',
  };

  private readonly allRows = computed<TransferRow[]>(() =>
    MOCK_TRANSFERS.map(t => ({
      ...t,
      itemCount: t.items.length,
      statusLabel: this.statusLabelMap[t.status],
    }))
  );

  readonly filteredData = computed<PaginatedResponse<TransferRow>>(() => {
    const tab = this.statusTab();
    const q = this.query().toLowerCase();
    let items = this.allRows();
    if (tab === 'PendingApproval') items = items.filter(t => t.status === 'PendingApproval');
    else if (tab === 'InTransit')  items = items.filter(t => t.status === 'InTransit' || t.status === 'PartiallyReceived');
    else if (tab === 'Received')   items = items.filter(t => t.status === 'Received');
    else if (tab === 'Cancelled')  items = items.filter(t => t.status === 'Cancelled');
    if (q) items = items.filter(t => t.fromStoreName.toLowerCase().includes(q) || t.toStoreName.toLowerCase().includes(q));
    const start = this.pageIndex() * this.pageSize();
    const ps = this.pageSize(); const total = items.length;
    const totalPages = Math.ceil(total / ps) || 1; const page = this.pageIndex() + 1;
    return { items: items.slice(start, start + ps), totalCount: total, pageNumber: page, pageSize: ps, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
  });

  setTab(t: StatusTab): void { this.filterSet(this.statusTab, t); }

  onRowClick(row: TransferRow): void {
    this.router.navigate(['/inventory/transfers', row.id]);
  }
}
