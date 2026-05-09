import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AreaUnit, FarmerCropDto, SeedCalculationResult, SeedProductMeta } from '@app/models/farmer.model';
import { MOCK_SEED_PRODUCTS } from '../farmers.data';

interface CalcForm {
  cropId: string;
  landArea: number | null;
  landAreaUnit: AreaUnit;
  rowSpacing: number | null;
  plantSpacing: number | null;
  spacingUnit: 'Inches' | 'Centimetres';
  productId: string;
  bufferPercent: number;
}

@Component({
  selector: 'app-seed-calculator',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './seed-calculator.component.html',
})
export class SeedCalculatorComponent {
  @Input() crops: FarmerCropDto[] = [];

  readonly seedProducts = MOCK_SEED_PRODUCTS;
  readonly areaUnits: AreaUnit[] = ['Acres', 'Hectares', 'SqFt'];
  readonly spacingUnits = ['Inches', 'Centimetres'] as const;

  form: CalcForm = {
    cropId: '',
    landArea: null,
    landAreaUnit: 'Acres',
    rowSpacing: null,
    plantSpacing: null,
    spacingUnit: 'Inches',
    productId: this.seedProducts[0]?.id ?? '',
    bufferPercent: 5,
  };

  result = signal<SeedCalculationResult | null>(null);

  get selectedCrop(): FarmerCropDto | null {
    return this.crops.find(c => c.id === this.form.cropId) ?? null;
  }

  get selectedProduct(): SeedProductMeta | null {
    return this.seedProducts.find(p => p.id === this.form.productId) ?? null;
  }

  onCropSelect(): void {
    const crop = this.selectedCrop;
    if (crop) {
      this.form.landArea = crop.areaInAcres;
      this.form.landAreaUnit = 'Acres';
    }
  }

  get canCalculate(): boolean {
    return !!(this.form.landArea && this.form.landArea > 0 &&
              this.form.rowSpacing && this.form.rowSpacing > 0 &&
              this.form.plantSpacing && this.form.plantSpacing > 0 &&
              this.form.productId);
  }

  calculate(): void {
    if (!this.canCalculate) return;
    const product = this.selectedProduct!;
    const landArea = this.form.landArea!;
    const row = this.form.rowSpacing!;
    const plant = this.form.plantSpacing!;

    // Convert land area to sq inches
    let landAreaSqIn: number;
    if (this.form.landAreaUnit === 'Acres') landAreaSqIn = landArea * 6272640;
    else if (this.form.landAreaUnit === 'Hectares') landAreaSqIn = landArea * 15500031;
    else landAreaSqIn = landArea * 144;

    // Convert spacing to inches
    const factor = this.form.spacingUnit === 'Centimetres' ? 0.393701 : 1;
    const rowIn = row * factor;
    const plantIn = plant * factor;

    // Calculation per spec
    const areaPerPlant = rowIn * plantIn;
    const totalPlants = Math.floor(landAreaSqIn / areaPerPlant);
    const seedsRequiredRaw = totalPlants;
    const seedsRequiredAdjusted = Math.ceil(seedsRequiredRaw / (product.germinationRate / 100));
    const packetsRequired = Math.ceil(seedsRequiredAdjusted / product.seedsPerPacket);
    const bufferPackets = Math.ceil(packetsRequired * this.form.bufferPercent / 100);
    const totalRecommendedPackets = packetsRequired + bufferPackets;

    this.result.set({
      landArea, landAreaUnit: this.form.landAreaUnit,
      rowSpacing: row, plantSpacing: plant, spacingUnit: this.form.spacingUnit,
      product, bufferPercent: this.form.bufferPercent,
      totalPlants, seedsRequiredRaw,
      seedsRequiredAdjusted, packetsRequired, bufferPackets, totalRecommendedPackets,
    });
  }

  reset(): void {
    this.result.set(null);
    this.form = {
      cropId: '', landArea: null, landAreaUnit: 'Acres',
      rowSpacing: null, plantSpacing: null, spacingUnit: 'Inches',
      productId: this.seedProducts[0]?.id ?? '',
      bufferPercent: 5,
    };
  }

  monthName(m: number): string {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] ?? '—';
  }
}
