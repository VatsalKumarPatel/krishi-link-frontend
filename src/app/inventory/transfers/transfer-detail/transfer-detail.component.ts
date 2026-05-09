import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent, BadgeVariant } from '@shared/badge/badge.component';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { StockTransferDto, TransferStatus, StockTransferItemDto } from '@app/models/inventory.model';
import { MOCK_TRANSFERS } from '../../inventory.data';

interface ReceiveItem extends StockTransferItemDto { receivingQty: number; }

@Component({
  selector: 'app-transfer-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent, KlDrawerComponent, FormsModule, DatePipe],
  templateUrl: './transfer-detail.component.html',
  styleUrl: './transfer-detail.component.scss',
})
export class TransferDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly transferId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly transfer = signal<StockTransferDto | null>(
    MOCK_TRANSFERS.find(t => t.id === this.transferId) ?? null
  );

  readonly receiveDrawerOpen = signal(false);
  readonly receiveItems = signal<ReceiveItem[]>([]);

  readonly statusLabelMap: Record<TransferStatus, string> = {
    Draft: 'Draft', PendingApproval: 'Pending Approval', Approved: 'Approved',
    InTransit: 'In Transit', PartiallyReceived: 'Partially Received',
    Received: 'Received', Cancelled: 'Cancelled',
  };

  statusVariant(status: TransferStatus): BadgeVariant {
    if (status === 'Received') return 'success';
    if (status === 'Cancelled') return 'danger';
    if (status === 'PendingApproval' || status === 'PartiallyReceived') return 'warning';
    if (status === 'InTransit' || status === 'Approved') return 'info';
    return 'neutral';
  }

  approve(): void {
    this.transfer.update(t => t ? { ...t, status: 'Approved' } : t);
  }

  dispatch(): void {
    this.transfer.update(t => t ? { ...t, status: 'InTransit' } : t);
  }

  cancel(): void {
    this.transfer.update(t => t ? { ...t, status: 'Cancelled' } : t);
  }

  openReceive(): void {
    const t = this.transfer();
    if (!t) return;
    this.receiveItems.set(t.items.map(i => ({ ...i, receivingQty: i.requestedQty - (i.receivedQty ?? 0) })));
    this.receiveDrawerOpen.set(true);
  }

  confirmReceive(): void {
    const items = this.receiveItems();
    const allReceived = items.every(i => i.receivingQty >= (i.requestedQty - (i.receivedQty ?? 0)));
    this.transfer.update(t => {
      if (!t) return t;
      const updatedItems = t.items.map(item => {
        const r = items.find(ri => ri.id === item.id);
        const newReceived = (item.receivedQty ?? 0) + (r?.receivingQty ?? 0);
        return { ...item, receivedQty: newReceived };
      });
      return { ...t, status: allReceived ? 'Received' : 'PartiallyReceived', items: updatedItems };
    });
    this.receiveDrawerOpen.set(false);
  }
}
