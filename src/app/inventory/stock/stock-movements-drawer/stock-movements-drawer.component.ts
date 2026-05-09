import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { BadgeVariant } from '@shared/badge/badge.component';
import { MOCK_LEDGER_ENTRIES, MOCK_STOCK } from '../../inventory.data';
import { InventoryLedgerEntryDto } from '@app/models/inventory.model';

@Component({
  selector: 'app-stock-movements-drawer',
  standalone: true,
  imports: [KlDrawerComponent, BadgeComponent],
  templateUrl: './stock-movements-drawer.component.html',
})
export class StockMovementsDrawerComponent {
  @Input() open = false;
  @Input() productId: string | null = null;
  @Output() closeDrawer = new EventEmitter<void>();

  get productName(): string {
    return MOCK_STOCK.find(s => s.productId === this.productId)?.productName ?? 'Product';
  }

  get entries(): InventoryLedgerEntryDto[] {
    return MOCK_LEDGER_ENTRIES;
  }

  entryVariant(entryType: string): BadgeVariant {
    if (['SaleIssue', 'TransferOut', 'AdjustmentDown', 'Damage'].includes(entryType)) return 'danger';
    if (['PurchaseReceive', 'TransferIn', 'AdjustmentUp', 'Return'].includes(entryType)) return 'success';
    return 'neutral';
  }

  close(): void { this.closeDrawer.emit(); }
}
