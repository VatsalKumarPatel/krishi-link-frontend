export type SeasonName = 'Kharif' | 'Rabi' | 'Zaid';
export type Gender = 'Male' | 'Female' | 'Other';
export type CropName = 'Wheat' | 'Rice' | 'Cotton' | 'Sugarcane' | 'Maize' | 'Soybean' | 'Groundnut' | 'Other';
export type AreaUnit = 'Acres' | 'Hectares' | 'SqFt';
export type IrrigationSource = 'Borewell' | 'Canal' | 'River' | 'Rainwater' | 'Drip' | 'Other';
export type SoilType = 'Black' | 'Red' | 'Alluvial' | 'Sandy' | 'Loamy' | 'Other';
export type GrowthStage = 'Sowing' | '30 Days' | '60 Days' | '90 Days' | 'Pre-Harvest' | 'Custom';

export interface TenantSeasonDto {
  id: string;
  seasonName: SeasonName;
  seasonYear: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  activatedAt?: string;
  activatedBy?: string;
}

export interface FarmerDto {
  id: string;
  farmerCode: string;
  firstName: string;
  lastName?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  pincode?: string;
  creditLimit: number;
  creditDays: number;
  isCreditAllowed: boolean;
  notes?: string;
  isActive: boolean;
  profileCompleteness: number;
  currentOutstanding: number;
  availableCredit: number;
}

export interface FarmerCropDto {
  id: string;
  farmerId: string;
  seasonName: SeasonName;
  seasonYear: string;
  cropName: CropName;
  areaUnderCrop: number;
  areaUnit: AreaUnit;
  areaInAcres: number;
  expectedSowingMonth: number;
  expectedHarvestMonth: number;
  irrigationSource?: IrrigationSource;
  soilType?: SoilType;
  notes?: string;
  isActive: boolean;
}

export interface SeedProductMeta {
  id: string;
  name: string;
  germinationRate: number;
  seedsPerPacket: number;
  returnPolicyDays: number;
}

export interface SeedCalculationResult {
  landArea: number;
  landAreaUnit: AreaUnit;
  rowSpacing: number;
  plantSpacing: number;
  spacingUnit: 'Inches' | 'Centimetres';
  product: SeedProductMeta | null;
  bufferPercent: number;
  totalPlants: number;
  seedsRequiredRaw: number;
  seedsRequiredAdjusted: number;
  packetsRequired: number;
  bufferPackets: number;
  totalRecommendedPackets: number;
}

export interface CropInputRecommendationDto {
  id: string;
  cropName: CropName;
  growthStage: GrowthStage;
  customStageName?: string;
  daysAfterSowing: number;
  productName: string;
  quantityPerAcre: number;
  unit: string;
  notes?: string;
  isActive: boolean;
}

/** Legacy enum kept for API compatibility */
export enum Season {
  Kharif = 1,
  Rabi   = 2,
  Zaid   = 3,
}
