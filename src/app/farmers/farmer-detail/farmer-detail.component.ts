import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { KlDetailHeaderComponent } from '@shared/kl-detail-header/kl-detail-header.component';
import { FarmerDto, FarmerCropDto, CropInputRecommendationDto } from '@app/models/farmer.model';
import { MOCK_FARMERS, MOCK_FARMER_CROPS, MOCK_CROP_INPUT_RECOMMENDATIONS, ACTIVE_SEASON } from '../farmers.data';
import { FarmerAddComponent } from '../farmer-add/farmer-add.component';
import { FarmerCropAddComponent } from '../farmer-crop-add/farmer-crop-add.component';
import { SeedCalculatorComponent } from '../seed-calculator/seed-calculator.component';

type Tab = 'overview' | 'crops' | 'calculator' | 'recommendations';

@Component({
  selector: 'app-farmer-detail',
  standalone: true,
  imports: [
    RouterLink, DatePipe, DecimalPipe,
    KlCardComponent, BadgeComponent, KlDetailHeaderComponent,
    FarmerAddComponent, FarmerCropAddComponent, SeedCalculatorComponent,
  ],
  templateUrl: './farmer-detail.component.html',
  styleUrl: './farmer-detail.component.scss',
})
export class FarmerDetailComponent {
  readonly farmer: FarmerDto;
  readonly activeSeason = ACTIVE_SEASON;

  activeTab = signal<Tab>('overview');
  editDrawerOpen = signal(false);
  cropDrawerOpen = signal(false);
  editCropId = signal<string | null>(null);

  readonly crops: FarmerCropDto[];
  readonly kharif2026Crops: FarmerCropDto[];
  readonly totalAreaAcres: number;
  readonly cropCount: number;

  readonly recommendations = computed<CropInputRecommendationDto[]>(() => {
    const cropNames = [...new Set(this.kharif2026Crops.map(c => c.cropName))];
    return MOCK_CROP_INPUT_RECOMMENDATIONS.filter(r => r.isActive && cropNames.includes(r.cropName));
  });

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id') ?? '';
    this.farmer = MOCK_FARMERS.find(f => f.id === id) ?? MOCK_FARMERS[0];
    this.crops = MOCK_FARMER_CROPS.filter(c => c.farmerId === this.farmer.id);
    this.kharif2026Crops = this.crops.filter(c => c.seasonName === 'Kharif' && c.seasonYear === '2026');
    this.totalAreaAcres = this.crops.reduce((s, c) => s + c.areaInAcres, 0);
    this.cropCount = new Set(this.crops.map(c => c.cropName)).size;
  }

  get initials(): string {
    return [this.farmer.firstName, this.farmer.lastName]
      .filter(Boolean).map(p => p![0]).join('').toUpperCase();
  }

  get fullName(): string {
    return [this.farmer.firstName, this.farmer.lastName].filter(Boolean).join(' ');
  }

  get completenessColor(): string {
    const p = this.farmer.profileCompleteness;
    if (p >= 80) return '#3C9A4A';
    if (p >= 50) return '#d97706';
    return '#dc2626';
  }

  monthName(m: number): string {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] ?? '—';
  }

  openAddCrop(): void { this.editCropId.set(null); this.cropDrawerOpen.set(true); }
  openEditCrop(id: string): void { this.editCropId.set(id); this.cropDrawerOpen.set(true); }
}
