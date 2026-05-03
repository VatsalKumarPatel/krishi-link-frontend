import { Component, Input } from '@angular/core';
import { Farmer } from '../farmer.data';
import { KlDrawerComponent } from '../../../shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '../../../shared/kl-drawer/kl-drawer-form-host';

@Component({
  selector: 'app-farmer-add',
  standalone: true,
  imports: [KlDrawerComponent],
  templateUrl: './farmer-add.component.html',
  styles: [':host { display: contents; }'],
})
export class FarmerAddComponent extends KlDrawerFormHost {
  @Input() farmer: Farmer | null = null;

  readonly regions = ['Chitwan', 'Kaski', 'Jhapa', 'Lamjung', 'Bardiya', 'Rupandehi'];
  readonly coops = ['-', 'Terai Fields Co-op', 'Pokhara Growers', 'East Plantations', 'Bardiya Farmers Union', 'Lumbini Pulses'];
  readonly statuses = ['Active', 'Needs review', 'Overdue', 'Draft'];

  get title(): string {
    return this.isEdit ? `Edit - ${this.farmer!.name}` : 'Add farmer';
  }

  get subtitle(): string {
    return this.isEdit
      ? `Farmer ID ${this.entityId}`
      : 'Register a new farmer. Crops and plots are managed on the detail page.';
  }

  protected get entityId(): string | null { return this.farmer?.id ?? null; }
  protected get entityIdInputName(): string { return 'farmer'; }
}
