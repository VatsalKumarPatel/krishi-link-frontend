import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Farmer } from '../farmer.data';
import { KlDrawerComponent } from '../../../shared/kl-drawer/kl-drawer.component';

@Component({
  selector: 'app-farmer-add',
  standalone: true,
  imports: [KlDrawerComponent],
  templateUrl: './farmer-add.component.html',
  styles: [':host { display: contents; }'],
})
export class FarmerAddComponent {
  @Input() open = false;
  @Input() farmer: Farmer | null = null;
  @Output() close = new EventEmitter<void>();

  readonly regions = ['Chitwan', 'Kaski', 'Jhapa', 'Lamjung', 'Bardiya', 'Rupandehi'];
  readonly coops = ['—', 'Terai Fields Co-op', 'Pokhara Growers', 'East Plantations', 'Bardiya Farmers Union', 'Lumbini Pulses'];
  readonly statuses = ['Active', 'Needs review', 'Overdue', 'Draft'];
}
