import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '../../../../shared/kl-drawer/kl-drawer.component';
import { StoreService } from '@services/store.service';
import { TenantService } from '@services/tenant.service';
import { StoreDto } from '@models/store.model';
import { TenantDropdownItem } from '@models/tenant.model';

interface StoreForm {
  tenantId: string;
  name: string;
  code: string;
  gstin: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  managerName: string;
}

function emptyForm(): StoreForm {
  return {
    tenantId: '', name: '', code: '', gstin: '',
    phone: '', email: '',
    addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
    isActive: true, managerName: '',
  };
}

function storeToForm(s: StoreDto): StoreForm {
  return {
    tenantId: s.tenantId ?? '',
    name: s.name ?? '',
    code: s.code ?? '',
    gstin: s.gstin ?? '',
    phone: s.phone ?? '',
    email: s.email ?? '',
    addressLine1: s.addressLine1 ?? '',
    addressLine2: s.addressLine2 ?? '',
    city: s.city ?? '',
    state: s.state ?? '',
    pincode: s.pincode ?? '',
    isActive: s.isActive,
    managerName: s.managerName ?? '',
  };
}

@Component({
  selector: 'app-store-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './store-add.component.html',
  styles: [':host { display: contents; }'],
})
export class StoreAddComponent implements OnChanges {
  @Input() open = false;
  @Input() store: StoreDto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private readonly storeService = inject(StoreService);
  private readonly tenantService = inject(TenantService);

  form: StoreForm = emptyForm();
  saving = false;
  saveError: string | null = null;

  tenants = signal<TenantDropdownItem[]>([]);
  tenantsLoading = signal(false);

  get isEdit(): boolean { return !!this.store?.id; }

  get title(): string {
    return this.isEdit ? `Edit · ${this.store!.name}` : 'Add store';
  }

  get subtitle(): string {
    if (!this.isEdit) return 'Register a new store location.';
    return `ID ${this.store!.id.slice(0, 8)}…`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open && this.tenants().length === 0) {
      this.loadTenants();
    }
    if (changes['store'] || changes['open']) {
      this.saveError = null;
      this.saving = false;
      this.form = this.store ? storeToForm(this.store) : emptyForm();
    }
  }

  private loadTenants(): void {
    this.tenantsLoading.set(true);
    this.tenantService.getDropdown().subscribe({
      next: (list) => { this.tenants.set(list); this.tenantsLoading.set(false); },
      error: () => { this.tenantsLoading.set(false); },
    });
  }

  submit(): void {
    if (this.saving) return;
    this.saving = true;
    this.saveError = null;

    if (this.isEdit) {
      const cmd = {
        id: this.store!.id,
        tenantId: this.form.tenantId || null,
        name: this.form.name || null,
        code: this.form.code || null,
        gstin: this.form.gstin || null,
        phone: this.form.phone || null,
        email: this.form.email || null,
        addressLine1: this.form.addressLine1 || null,
        addressLine2: this.form.addressLine2 || null,
        city: this.form.city || null,
        state: this.form.state || null,
        pincode: this.form.pincode || null,
        isActive: this.form.isActive,
        managerName: this.form.managerName || null,
      };
      this.storeService.update(this.store!.id, cmd).subscribe({
        next: () => { this.saving = false; this.saved.emit(); },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.message ?? 'Failed to update store.';
        },
      });
    } else {
      const cmd = {
        tenantId: this.form.tenantId || null,
        name: this.form.name || null,
        code: this.form.code || null,
        gstin: this.form.gstin || null,
        phone: this.form.phone || null,
        email: this.form.email || null,
        addressLine1: this.form.addressLine1 || null,
        addressLine2: this.form.addressLine2 || null,
        city: this.form.city || null,
        state: this.form.state || null,
        pincode: this.form.pincode || null,
        managerName: this.form.managerName || null,
      };
      this.storeService.create(cmd).subscribe({
        next: () => { this.saving = false; this.saved.emit(); },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.message ?? 'Failed to create store.';
        },
      });
    }
  }
}
