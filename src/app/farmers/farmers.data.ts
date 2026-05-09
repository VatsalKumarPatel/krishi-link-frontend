import { TenantSeasonDto, FarmerDto, FarmerCropDto, SeedProductMeta, CropInputRecommendationDto } from '@app/models/farmer.model';

export const ACTIVE_SEASON: TenantSeasonDto = {
  id: 'season-1',
  seasonName: 'Kharif',
  seasonYear: '2026',
  startDate: '2026-06-01',
  endDate: '2026-11-30',
  isActive: true,
  activatedAt: '2026-05-01',
  activatedBy: 'TenantAdmin',
};

export const MOCK_FARMERS: FarmerDto[] = [
  {
    id: 'f1', farmerCode: 'FRM-NGP-00001',
    firstName: 'Ramesh', lastName: 'Waghmare',
    mobileNumber: '9876543210', gender: 'Male',
    dateOfBirth: '1975-03-14',
    village: 'Hingna', taluka: 'Hingna', district: 'Nagpur', state: 'Maharashtra', pincode: '441110',
    creditLimit: 50000, creditDays: 120, isCreditAllowed: true,
    notes: 'Long-standing customer. Prefers cash payment in December after wheat harvest.',
    isActive: true, profileCompleteness: 95,
    currentOutstanding: 18500, availableCredit: 31500,
  },
  {
    id: 'f2', farmerCode: 'FRM-NGP-00002',
    firstName: 'Sunita', lastName: 'Borkar',
    mobileNumber: '9871234567', gender: 'Female',
    village: 'Wardha', taluka: 'Wardha', district: 'Wardha', state: 'Maharashtra', pincode: '442001',
    creditLimit: 30000, creditDays: 90, isCreditAllowed: true,
    isActive: true, profileCompleteness: 78,
    currentOutstanding: 0, availableCredit: 30000,
  },
  {
    id: 'f3', farmerCode: 'FRM-NGP-00003',
    firstName: 'Kiran', lastName: 'Thakre',
    mobileNumber: '9823456781', gender: 'Male',
    village: 'Amravati', taluka: 'Amravati', district: 'Amravati', state: 'Maharashtra', pincode: '444601',
    creditLimit: 75000, creditDays: 180, isCreditAllowed: true,
    notes: 'Large farm operator. Requires bulk quantities every June and November.',
    isActive: true, profileCompleteness: 88,
    currentOutstanding: 42000, availableCredit: 33000,
  },
  {
    id: 'f4', farmerCode: 'FRM-NGP-00004',
    firstName: 'Priya', lastName: 'Mandlik',
    mobileNumber: '9765432109', gender: 'Female',
    village: 'Katol', taluka: 'Katol', district: 'Nagpur', state: 'Maharashtra', pincode: '441302',
    creditLimit: 20000, creditDays: 60, isCreditAllowed: true,
    isActive: true, profileCompleteness: 72,
    currentOutstanding: 0, availableCredit: 20000,
  },
  {
    id: 'f5', farmerCode: 'FRM-NGP-00005',
    firstName: 'Mahesh', lastName: 'Patel',
    mobileNumber: '9812345678', gender: 'Male',
    village: 'Yavatmal', taluka: 'Yavatmal', district: 'Yavatmal', state: 'Maharashtra', pincode: '445001',
    creditLimit: 0, creditDays: 0, isCreditAllowed: false,
    isActive: false, profileCompleteness: 60,
    currentOutstanding: 0, availableCredit: 0,
  },
  {
    id: 'f6', farmerCode: 'FRM-NGP-00006',
    firstName: 'Anita', lastName: 'Deshpande',
    mobileNumber: '9988776655', gender: 'Female',
    dateOfBirth: '1980-07-22',
    village: 'Dhamangaon', taluka: 'Dhamangaon', district: 'Amravati', state: 'Maharashtra', pincode: '444709',
    creditLimit: 40000, creditDays: 120, isCreditAllowed: true,
    isActive: true, profileCompleteness: 90,
    currentOutstanding: 12000, availableCredit: 28000,
  },
  {
    id: 'f7', farmerCode: 'FRM-NGP-00007',
    firstName: 'Suresh', lastName: 'Bhoyar',
    mobileNumber: '9011223344', gender: 'Male',
    village: 'Arvi', taluka: 'Arvi', district: 'Wardha', state: 'Maharashtra', pincode: '442201',
    creditLimit: 25000, creditDays: 90, isCreditAllowed: true,
    isActive: true, profileCompleteness: 65,
    currentOutstanding: 25000, availableCredit: 0,
  },
  {
    id: 'f8', farmerCode: 'FRM-NGP-00008',
    firstName: 'Kavitha', lastName: 'Yerme',
    gender: 'Female',
    village: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
    creditLimit: 15000, creditDays: 60, isCreditAllowed: false,
    isActive: true, profileCompleteness: 42,
    currentOutstanding: 0, availableCredit: 0,
  },
  {
    id: 'f9', farmerCode: 'FRM-NGP-00009',
    firstName: 'Dilip', lastName: 'Kale',
    mobileNumber: '9922334455', gender: 'Male',
    dateOfBirth: '1968-11-05',
    village: 'Umred', taluka: 'Umred', district: 'Nagpur', state: 'Maharashtra', pincode: '441203',
    creditLimit: 60000, creditDays: 150, isCreditAllowed: true,
    notes: 'Farmer cooperative member. Purchases collectively with 3 other farmers.',
    isActive: true, profileCompleteness: 92,
    currentOutstanding: 0, availableCredit: 60000,
  },
  {
    id: 'f10', farmerCode: 'FRM-NGP-00010',
    firstName: 'Meena', lastName: 'Raut',
    mobileNumber: '9876501234', gender: 'Female',
    village: 'Wardha', district: 'Wardha', state: 'Maharashtra',
    creditLimit: 10000, creditDays: 60, isCreditAllowed: true,
    isActive: true, profileCompleteness: 55,
    currentOutstanding: 8500, availableCredit: 1500,
  },
  {
    id: 'f11', farmerCode: 'FRM-NGP-00011',
    firstName: 'Vikas', lastName: 'Shivarkar',
    mobileNumber: '9833445566', gender: 'Male',
    village: 'Chandur Bazar', taluka: 'Chandur Bazar', district: 'Amravati', state: 'Maharashtra', pincode: '444702',
    creditLimit: 35000, creditDays: 90, isCreditAllowed: true,
    isActive: true, profileCompleteness: 80,
    currentOutstanding: 5000, availableCredit: 30000,
  },
  {
    id: 'f12', farmerCode: 'FRM-NGP-00012',
    firstName: 'Nanda', lastName: 'Gawande',
    mobileNumber: '9744556677', gender: 'Female',
    dateOfBirth: '1982-04-18',
    village: 'Narkhed', taluka: 'Narkhed', district: 'Nagpur', state: 'Maharashtra', pincode: '441304',
    creditLimit: 20000, creditDays: 90, isCreditAllowed: true,
    isActive: true, profileCompleteness: 85,
    currentOutstanding: 0, availableCredit: 20000,
  },
];

export const MOCK_FARMER_CROPS: FarmerCropDto[] = [
  // Ramesh Waghmare (f1) — Kharif: Cotton + Soybean; Rabi: Wheat
  { id: 'fc1', farmerId: 'f1', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Cotton', areaUnderCrop: 3, areaUnit: 'Acres', areaInAcres: 3, expectedSowingMonth: 6, expectedHarvestMonth: 11, irrigationSource: 'Borewell', soilType: 'Black', isActive: true },
  { id: 'fc2', farmerId: 'f1', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Soybean', areaUnderCrop: 2, areaUnit: 'Acres', areaInAcres: 2, expectedSowingMonth: 6, expectedHarvestMonth: 10, irrigationSource: 'Borewell', soilType: 'Black', isActive: true },
  { id: 'fc3', farmerId: 'f1', seasonName: 'Rabi', seasonYear: '2025-26', cropName: 'Wheat', areaUnderCrop: 5, areaUnit: 'Acres', areaInAcres: 5, expectedSowingMonth: 11, expectedHarvestMonth: 4, irrigationSource: 'Canal', soilType: 'Black', isActive: true },

  // Sunita Borkar (f2) — Kharif: Cotton
  { id: 'fc4', farmerId: 'f2', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Cotton', areaUnderCrop: 3, areaUnit: 'Acres', areaInAcres: 3, expectedSowingMonth: 6, expectedHarvestMonth: 11, irrigationSource: 'Rainwater', soilType: 'Black', isActive: true },

  // Kiran Thakre (f3) — Kharif: Cotton + Soybean + Maize; Rabi: Wheat
  { id: 'fc5', farmerId: 'f3', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Cotton', areaUnderCrop: 4, areaUnit: 'Acres', areaInAcres: 4, expectedSowingMonth: 6, expectedHarvestMonth: 11, irrigationSource: 'Borewell', soilType: 'Black', isActive: true },
  { id: 'fc6', farmerId: 'f3', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Soybean', areaUnderCrop: 3, areaUnit: 'Acres', areaInAcres: 3, expectedSowingMonth: 6, expectedHarvestMonth: 10, irrigationSource: 'Borewell', soilType: 'Black', isActive: true },
  { id: 'fc7', farmerId: 'f3', seasonName: 'Rabi', seasonYear: '2025-26', cropName: 'Wheat', areaUnderCrop: 8, areaUnit: 'Acres', areaInAcres: 8, expectedSowingMonth: 11, expectedHarvestMonth: 5, irrigationSource: 'Canal', soilType: 'Black', isActive: true },

  // Priya Mandlik (f4) — Kharif: Soybean; Rabi: Wheat (harvesting this month May)
  { id: 'fc8', farmerId: 'f4', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Soybean', areaUnderCrop: 2, areaUnit: 'Acres', areaInAcres: 2, expectedSowingMonth: 6, expectedHarvestMonth: 10, isActive: true },
  { id: 'fc9', farmerId: 'f4', seasonName: 'Rabi', seasonYear: '2025-26', cropName: 'Wheat', areaUnderCrop: 2, areaUnit: 'Acres', areaInAcres: 2, expectedSowingMonth: 11, expectedHarvestMonth: 5, irrigationSource: 'Canal', isActive: true },

  // Anita Deshpande (f6) — Kharif: Cotton + Soybean
  { id: 'fc10', farmerId: 'f6', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Cotton', areaUnderCrop: 3.5, areaUnit: 'Acres', areaInAcres: 3.5, expectedSowingMonth: 6, expectedHarvestMonth: 11, irrigationSource: 'Drip', soilType: 'Black', isActive: true },
  { id: 'fc11', farmerId: 'f6', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Soybean', areaUnderCrop: 2.5, areaUnit: 'Acres', areaInAcres: 2.5, expectedSowingMonth: 7, expectedHarvestMonth: 10, irrigationSource: 'Drip', soilType: 'Black', isActive: true },

  // Suresh Bhoyar (f7) — Kharif: Rice; Rabi: Wheat
  { id: 'fc12', farmerId: 'f7', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Rice', areaUnderCrop: 2, areaUnit: 'Acres', areaInAcres: 2, expectedSowingMonth: 7, expectedHarvestMonth: 11, irrigationSource: 'Canal', soilType: 'Alluvial', isActive: true },
  { id: 'fc13', farmerId: 'f7', seasonName: 'Rabi', seasonYear: '2025-26', cropName: 'Wheat', areaUnderCrop: 1.5, areaUnit: 'Acres', areaInAcres: 1.5, expectedSowingMonth: 11, expectedHarvestMonth: 5, irrigationSource: 'Canal', isActive: true },

  // Dilip Kale (f9) — Kharif: Soybean + Groundnut; Rabi: Wheat
  { id: 'fc14', farmerId: 'f9', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Soybean', areaUnderCrop: 4, areaUnit: 'Acres', areaInAcres: 4, expectedSowingMonth: 6, expectedHarvestMonth: 10, irrigationSource: 'Borewell', soilType: 'Black', isActive: true },
  { id: 'fc15', farmerId: 'f9', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Groundnut', areaUnderCrop: 3, areaUnit: 'Acres', areaInAcres: 3, expectedSowingMonth: 6, expectedHarvestMonth: 10, irrigationSource: 'Borewell', soilType: 'Red', isActive: true },
  { id: 'fc16', farmerId: 'f9', seasonName: 'Rabi', seasonYear: '2025-26', cropName: 'Wheat', areaUnderCrop: 7, areaUnit: 'Acres', areaInAcres: 7, expectedSowingMonth: 11, expectedHarvestMonth: 5, irrigationSource: 'Canal', soilType: 'Black', isActive: true },

  // Meena Raut (f10) — Kharif: Cotton
  { id: 'fc17', farmerId: 'f10', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Cotton', areaUnderCrop: 1.5, areaUnit: 'Acres', areaInAcres: 1.5, expectedSowingMonth: 6, expectedHarvestMonth: 11, irrigationSource: 'Rainwater', soilType: 'Black', isActive: true },

  // Vikas Shivarkar (f11) — Kharif: Soybean + Maize
  { id: 'fc18', farmerId: 'f11', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Soybean', areaUnderCrop: 2.5, areaUnit: 'Acres', areaInAcres: 2.5, expectedSowingMonth: 6, expectedHarvestMonth: 10, irrigationSource: 'Borewell', soilType: 'Black', isActive: true },
  { id: 'fc19', farmerId: 'f11', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Maize', areaUnderCrop: 1.5, areaUnit: 'Acres', areaInAcres: 1.5, expectedSowingMonth: 6, expectedHarvestMonth: 9, irrigationSource: 'Borewell', isActive: true },

  // Nanda Gawande (f12) — Kharif: Groundnut; Rabi: Wheat
  { id: 'fc20', farmerId: 'f12', seasonName: 'Kharif', seasonYear: '2026', cropName: 'Groundnut', areaUnderCrop: 3, areaUnit: 'Acres', areaInAcres: 3, expectedSowingMonth: 6, expectedHarvestMonth: 10, irrigationSource: 'Borewell', soilType: 'Red', isActive: true },
  { id: 'fc21', farmerId: 'f12', seasonName: 'Rabi', seasonYear: '2025-26', cropName: 'Wheat', areaUnderCrop: 2, areaUnit: 'Acres', areaInAcres: 2, expectedSowingMonth: 11, expectedHarvestMonth: 5, irrigationSource: 'Canal', soilType: 'Black', isActive: true },
];

export const MOCK_SEED_PRODUCTS: SeedProductMeta[] = [
  { id: 'sp1', name: 'NMK-151 Cotton Hybrid', germinationRate: 90, seedsPerPacket: 450, returnPolicyDays: 15 },
  { id: 'sp2', name: 'JS-9560 Soybean', germinationRate: 85, seedsPerPacket: 1200, returnPolicyDays: 10 },
  { id: 'sp3', name: 'DHM-117 Maize Hybrid', germinationRate: 92, seedsPerPacket: 4000, returnPolicyDays: 15 },
  { id: 'sp4', name: 'GJG-31 Groundnut', germinationRate: 80, seedsPerPacket: 18000, returnPolicyDays: 0 },
  { id: 'sp5', name: 'HD-2967 Wheat', germinationRate: 88, seedsPerPacket: 5000, returnPolicyDays: 10 },
  { id: 'sp6', name: 'IR-64 Paddy', germinationRate: 82, seedsPerPacket: 8000, returnPolicyDays: 0 },
];

export const MOCK_CROP_INPUT_RECOMMENDATIONS: CropInputRecommendationDto[] = [
  // Cotton
  { id: 'r1', cropName: 'Cotton', growthStage: 'Sowing', daysAfterSowing: 0, productName: 'DAP (18:46:00)', quantityPerAcre: 1, unit: 'Bag (50kg)', notes: 'Apply at time of sowing', isActive: true },
  { id: 'r2', cropName: 'Cotton', growthStage: '30 Days', daysAfterSowing: 30, productName: 'Urea (46% N)', quantityPerAcre: 0.5, unit: 'Bag (50kg)', notes: 'Side dressing after first irrigation', isActive: true },
  { id: 'r3', cropName: 'Cotton', growthStage: '60 Days', daysAfterSowing: 60, productName: 'Chlorpyriphos 20% EC', quantityPerAcre: 1, unit: 'Litre', notes: 'For aphid and bollworm control', isActive: true },
  { id: 'r4', cropName: 'Cotton', growthStage: '90 Days', daysAfterSowing: 90, productName: 'MOP (60% K2O)', quantityPerAcre: 0.5, unit: 'Bag (50kg)', isActive: true },
  // Soybean
  { id: 'r5', cropName: 'Soybean', growthStage: 'Sowing', daysAfterSowing: 0, productName: 'SSP (16% P2O5)', quantityPerAcre: 2, unit: 'Bag (50kg)', notes: 'Basal application', isActive: true },
  { id: 'r6', cropName: 'Soybean', growthStage: '30 Days', daysAfterSowing: 30, productName: 'Thiram 75% WS', quantityPerAcre: 0.5, unit: 'Kg', notes: 'Fungicide for pod blight', isActive: true },
  { id: 'r7', cropName: 'Soybean', growthStage: '60 Days', daysAfterSowing: 60, productName: '13:00:45 WSF', quantityPerAcre: 1, unit: 'Kg', notes: 'Foliar spray at pod fill stage', isActive: true },
  // Wheat
  { id: 'r8', cropName: 'Wheat', growthStage: 'Sowing', daysAfterSowing: 0, productName: 'DAP (18:46:00)', quantityPerAcre: 1, unit: 'Bag (50kg)', notes: 'Basal dose', isActive: true },
  { id: 'r9', cropName: 'Wheat', growthStage: '30 Days', daysAfterSowing: 30, productName: 'Urea (46% N)', quantityPerAcre: 1, unit: 'Bag (50kg)', notes: 'First top dressing after irrigation', isActive: true },
  { id: 'r10', cropName: 'Wheat', growthStage: '60 Days', daysAfterSowing: 60, productName: 'Urea (46% N)', quantityPerAcre: 0.5, unit: 'Bag (50kg)', notes: 'Second top dressing at tillering', isActive: true },
  // Groundnut
  { id: 'r11', cropName: 'Groundnut', growthStage: 'Sowing', daysAfterSowing: 0, productName: 'SSP (16% P2O5)', quantityPerAcre: 3, unit: 'Bag (50kg)', isActive: true },
  { id: 'r12', cropName: 'Groundnut', growthStage: '30 Days', daysAfterSowing: 30, productName: 'Gypsum', quantityPerAcre: 100, unit: 'Kg', notes: 'Pod filling — critical for groundnut', isActive: true },
  // Maize
  { id: 'r13', cropName: 'Maize', growthStage: 'Sowing', daysAfterSowing: 0, productName: 'DAP (18:46:00)', quantityPerAcre: 1, unit: 'Bag (50kg)', isActive: true },
  { id: 'r14', cropName: 'Maize', growthStage: '30 Days', daysAfterSowing: 30, productName: 'Urea (46% N)', quantityPerAcre: 1, unit: 'Bag (50kg)', notes: 'Side dressing at knee-high stage', isActive: true },
];
