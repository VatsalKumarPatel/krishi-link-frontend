import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { StockAdjustmentDto } from '@app/models/inventory.model';
import { MOCK_ADJUSTMENTS } from '../../inventory.data';

@Component({
  selector: 'app-pending-adjustments',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './pending-adjustments.component.html',
  styleUrl: './pending-adjustments.component.scss',
})
export class PendingAdjustmentsComponent {
  readonly rejectingId = signal<string | null>(null);
  readonly rejectionReason = signal('');
  readonly items = signal<StockAdjustmentDto[]>(
    MOCK_ADJUSTMENTS.filter(a => a.status === 'PendingApproval')
  );

  typeLabel(type: string): string {
    if (type === 'ManualCorrection') return 'Manual';
    if (type === 'PhysicalCount') return 'Physical Count';
    return 'Damage';
  }

  approve(id: string): void {
    this.items.update(list => list.filter(a => a.id !== id));
  }

  startReject(id: string): void {
    this.rejectingId.set(id);
    this.rejectionReason.set('');
  }

  cancelReject(): void { this.rejectingId.set(null); }

  confirmReject(id: string): void {
    if (!this.rejectionReason().trim()) return;
    this.items.update(list => list.filter(a => a.id !== id));
    this.rejectingId.set(null);
  }
}
