import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { AlertComponent } from '@shared/alert/alert.component';
import { CropName, AreaUnit, IrrigationSource, SoilType, FarmerCropDto } from '@app/models/farmer.model';
import { ACTIVE_SEASON, MOCK_FARMER_CROPS } from '../farmers.data';

interface CropForm {
  cropName: CropName;
  areaUnderCrop: number | null;
  areaUnit: AreaUnit;
  expectedSowingMonth: number | null;
  expectedHarvestMonth: number | null;
  irrigationSource: IrrigationSource | '';
  soilType: SoilType | '';
  notes: string;
}

@Component({
  selector: 'app-farmer-crop-add',
  standalone: true,
  imports: [KlDrawerComponent, FormsModule, AlertComponent],
  templateUrl: './farmer-crop-add.component.html',
})
export class FarmerCropAddComponent extends KlDrawerFormHost {
  @Input() cropId: string | null = null;
  @Input() farmerId: string | null = null;

  readonly season = ACTIVE_SEASON;
  readonly cropNames: CropName[] = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Groundnut', 'Other'];
  readonly areaUnits: AreaUnit[] = ['Acres', 'Hectares', 'SqFt'];
  readonly irrigationSources: IrrigationSource[] = ['Borewell', 'Canal', 'River', 'Rainwater', 'Drip', 'Other'];
  readonly soilTypes: SoilType[] = ['Black', 'Red', 'Alluvial', 'Sandy', 'Loamy', 'Other'];
  readonly months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  form: CropForm = this.emptyForm();
  saving = false;
  saveError: string | null = null;

  protected get entityId(): string | null { return this.cropId; }
  protected get entityIdInputName(): string { return 'cropId'; }

  protected override onDrawerStateChange(_changes: SimpleChanges): void {
    this.saveError = null;
    if (this.open && this.isEdit) {
      const crop = MOCK_FARMER_CROPS.find(c => c.id === this.cropId);
      if (crop) this.loadCrop(crop);
    } else if (this.open) {
      this.form = this.emptyForm();
    }
  }

  private emptyForm(): CropForm {
    return { cropName: 'Cotton', areaUnderCrop: null, areaUnit: 'Acres', expectedSowingMonth: null, expectedHarvestMonth: null, irrigationSource: '', soilType: '', notes: '' };
  }

  private loadCrop(c: FarmerCropDto): void {
    this.form = {
      cropName: c.cropName,
      areaUnderCrop: c.areaUnderCrop,
      areaUnit: c.areaUnit,
      expectedSowingMonth: c.expectedSowingMonth,
      expectedHarvestMonth: c.expectedHarvestMonth,
      irrigationSource: c.irrigationSource ?? '',
      soilType: c.soilType ?? '',
      notes: c.notes ?? '',
    };
  }

  get title(): string { return this.isEdit ? 'Edit Crop' : 'Add Crop'; }
  get subtitle(): string { return `${this.season.seasonName} ${this.season.seasonYear} · Season is auto-applied`; }

  get canSubmit(): boolean {
    return !!this.form.cropName && this.form.areaUnderCrop != null && this.form.areaUnderCrop > 0;
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
