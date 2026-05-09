import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { AlertComponent } from '@shared/alert/alert.component';
import { FarmerDto, Gender } from '@app/models/farmer.model';
import { MOCK_FARMERS } from '../farmers.data';

interface FarmerForm {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gender: Gender | '';
  dateOfBirth: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  isCreditAllowed: boolean;
  creditLimit: number | null;
  creditDays: number | null;
  notes: string;
  isActive: boolean;
}

@Component({
  selector: 'app-farmer-add',
  standalone: true,
  imports: [KlDrawerComponent, FormsModule, AlertComponent],
  templateUrl: './farmer-add.component.html',
})
export class FarmerAddComponent extends KlDrawerFormHost {
  @Input() farmerId: string | null = null;

  readonly genders: Gender[] = ['Male', 'Female', 'Other'];
  readonly states = ['Maharashtra', 'Madhya Pradesh', 'Chhattisgarh', 'Telangana', 'Karnataka'];

  form: FarmerForm = this.emptyForm();
  saving = false;
  saveError: string | null = null;
  mobileWarning = false;

  protected get entityId(): string | null { return this.farmerId; }
  protected get entityIdInputName(): string { return 'farmerId'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    this.saveError = null;
    this.mobileWarning = false;
    if (this.open && this.isEdit) {
      const farmer = MOCK_FARMERS.find(f => f.id === this.farmerId);
      if (farmer) this.loadFarmer(farmer);
    } else if (this.open) {
      this.form = this.emptyForm();
    }
  }

  private emptyForm(): FarmerForm {
    return {
      firstName: '', lastName: '', mobileNumber: '', gender: '', dateOfBirth: '',
      village: '', taluka: '', district: '', state: 'Maharashtra', pincode: '',
      isCreditAllowed: false, creditLimit: null, creditDays: null,
      notes: '', isActive: true,
    };
  }

  private loadFarmer(f: FarmerDto): void {
    this.form = {
      firstName: f.firstName,
      lastName: f.lastName ?? '',
      mobileNumber: f.mobileNumber ?? '',
      gender: f.gender ?? '',
      dateOfBirth: f.dateOfBirth ?? '',
      village: f.village ?? '',
      taluka: f.taluka ?? '',
      district: f.district ?? '',
      state: f.state ?? 'Maharashtra',
      pincode: f.pincode ?? '',
      isCreditAllowed: f.isCreditAllowed,
      creditLimit: f.creditLimit || null,
      creditDays: f.creditDays || null,
      notes: f.notes ?? '',
      isActive: f.isActive,
    };
  }

  get title(): string { return this.isEdit ? 'Edit Farmer' : 'Add Farmer'; }
  get subtitle(): string {
    return this.isEdit
      ? `${MOCK_FARMERS.find(f => f.id === this.farmerId)?.farmerCode ?? ''}`
      : 'Only First Name is required — add more details progressively.';
  }

  get canSubmit(): boolean { return !!this.form.firstName.trim(); }

  onMobileChange(): void {
    const mob = this.form.mobileNumber.trim();
    if (!mob) { this.mobileWarning = false; return; }
    const exists = MOCK_FARMERS.some(f => f.mobileNumber === mob && f.id !== this.farmerId);
    this.mobileWarning = exists;
  }

  submit(): void {
    if (this.saving || !this.canSubmit) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.notifySaved();
    }, 600);
  }
}
