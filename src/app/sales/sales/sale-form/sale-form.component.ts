import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { SalePaymentMode } from '@models/sale.model';

interface MockFarmer {
  id: string;
  farmerCode: string;
  farmerName: string;
  creditLimit: number;
  creditDays: number;
  availableCredit: number;
  isCreditAllowed: boolean;
}

const MOCK_FARMERS: MockFarmer[] = [
  { id: 'f001', farmerCode: 'FARM-DEL-0042', farmerName: 'Ramesh Kumar',  creditLimit: 50000, creditDays: 30, availableCredit: 31500, isCreditAllowed: true },
  { id: 'f002', farmerCode: 'FARM-DEL-0031', farmerName: 'Sunita Poudel', creditLimit: 25000, creditDays: 15, availableCredit: 25000, isCreditAllowed: true },
  { id: 'f003', farmerCode: 'FARM-DEL-0055', farmerName: 'Arjun Rai',     creditLimit: 30000, creditDays: 30, availableCredit: 30000, isCreditAllowed: true },
  { id: 'f004', farmerCode: 'FARM-DEL-0018', farmerName: 'Maya Gurung',   creditLimit: 40000, creditDays: 30, availableCredit: 0,     isCreditAllowed: false },
  { id: 'f005', farmerCode: 'FARM-DEL-0072', farmerName: 'Raju Thapa',    creditLimit: 20000, creditDays: 30, availableCredit: 1500,  isCreditAllowed: true },
];

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.scss',
})
export class SaleFormComponent {
  protected readonly setTimeout = setTimeout;

  readonly farmerSearch = signal('');
  readonly showFarmerDrop = signal(false);
  readonly selectedFarmer = signal<MockFarmer | null>(null);
  readonly paymentMode = signal<SalePaymentMode>('Cash');
  readonly creditDays = signal(30);
  readonly saleDate = signal(new Date().toISOString().substring(0, 10));
  readonly notes = signal('');
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly farmerResults = computed(() => {
    const q = this.farmerSearch().toLowerCase();
    if (!q) return MOCK_FARMERS;
    return MOCK_FARMERS.filter(f => f.farmerName.toLowerCase().includes(q) || f.farmerCode.toLowerCase().includes(q));
  });

  readonly modes: SalePaymentMode[] = ['Cash', 'Credit', 'UPI', 'Mixed'];

  selectFarmer(f: MockFarmer): void {
    this.selectedFarmer.set(f);
    this.farmerSearch.set(f.farmerName);
    this.showFarmerDrop.set(false);
    this.creditDays.set(f.creditDays);
  }

  onFarmerInput(val: string): void {
    this.farmerSearch.set(val);
    this.showFarmerDrop.set(true);
    if (!val) this.selectedFarmer.set(null);
  }

  createDraft(): void {
    if (!this.selectedFarmer()) { this.error.set('Please select a farmer.'); return; }
    this.saving.set(true);
    this.error.set(null);
    setTimeout(() => { this.saving.set(false); }, 600);
  }

  fmtInr(n: number): string { return `₹${n.toLocaleString('en-IN')}`; }
}
