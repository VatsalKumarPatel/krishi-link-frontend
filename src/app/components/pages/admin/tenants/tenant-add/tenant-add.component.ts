import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '../../../../shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '../../../../shared/kl-drawer/kl-drawer-form-host';
import { TenantService } from '@services/tenant.service';
import { ToastService } from '@services/toast.service';
import { TenantDto } from '@models/tenant.model';

interface TenantForm {
  name: string;
  slug: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  subscriptionExpiresAt: string;
}

function emptyForm(): TenantForm {
  return {
    name: '',
    slug: '',
    gstin: '',
    pan: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isActive: true,
    subscriptionExpiresAt: '',
  };
}

function tenantToForm(t: TenantDto): TenantForm {
  return {
    name: t.name ?? '',
    slug: t.slug ?? '',
    gstin: t.gstin ?? '',
    pan: t.pan ?? '',
    phone: t.phone ?? '',
    email: t.email ?? '',
    addressLine1: t.addressLine1 ?? '',
    addressLine2: t.addressLine2 ?? '',
    city: t.city ?? '',
    state: t.state ?? '',
    pincode: t.pincode ?? '',
    isActive: t.isActive,
    subscriptionExpiresAt: t.subscriptionExpiresAt
      ? t.subscriptionExpiresAt.split('T')[0]
      : '',
  };
}

@Component({
  selector: 'app-tenant-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './tenant-add.component.html',
  styles: [':host { display: contents; }'],
})
export class TenantAddComponent extends KlDrawerFormHost {
  @Input() tenant: TenantDto | null = null;

  private readonly tenantService = inject(TenantService);
  private readonly toast = inject(ToastService);

  form: TenantForm = emptyForm();
  saving = false;
  saveError: string | null = null;

  get title(): string {
    return this.isEdit ? `Edit - ${this.tenant!.name}` : 'Add tenant';
  }

  get subtitle(): string {
    return this.isEdit ? `ID ${this.shortId()}` : 'Register a new organisation on the platform.';
  }

  protected get entityId(): string | null { return this.tenant?.id ?? null; }
  protected get entityIdInputName(): string { return 'tenant'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    this.saveError = null;
    this.saving = false;
    this.form = this.tenant ? tenantToForm(this.tenant) : emptyForm();
  }

  submit(): void {
    if (this.saving) return;
    this.saving = true;
    this.saveError = null;

    const expiresAt = this.form.subscriptionExpiresAt
      ? new Date(this.form.subscriptionExpiresAt).toISOString()
      : null;

    if (this.isEdit) {
      const cmd = {
        id: this.tenant!.id,
        name: this.form.name || null,
        gstin: this.form.gstin || null,
        pan: this.form.pan || null,
        phone: this.form.phone || null,
        email: this.form.email || null,
        addressLine1: this.form.addressLine1 || null,
        addressLine2: this.form.addressLine2 || null,
        city: this.form.city || null,
        state: this.form.state || null,
        pincode: this.form.pincode || null,
        isActive: this.form.isActive,
        subscriptionExpiresAt: expiresAt,
      };
      this.tenantService.update(this.tenant!.id, cmd).subscribe({
        next: () => {
          this.saving = false;
          this.toast.success('Tenant updated successfully.');
          this.notifySaved();
        },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.message ?? 'Failed to update tenant.';
          this.toast.error(this.saveError!);
        },
      });
    } else {
      const cmd = {
        name: this.form.name || null,
        slug: this.form.slug || null,
        gstin: this.form.gstin || null,
        pan: this.form.pan || null,
        phone: this.form.phone || null,
        email: this.form.email || null,
        addressLine1: this.form.addressLine1 || null,
        addressLine2: this.form.addressLine2 || null,
        city: this.form.city || null,
        state: this.form.state || null,
        pincode: this.form.pincode || null,
        subscriptionExpiresAt: expiresAt,
      };
      this.tenantService.create(cmd).subscribe({
        next: () => {
          this.saving = false;
          this.toast.success('Tenant created successfully.');
          this.notifySaved();
        },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.message ?? 'Failed to create tenant.';
          this.toast.error(this.saveError!);
        },
      });
    }
  }
}
