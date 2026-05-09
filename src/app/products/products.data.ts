import { ProductDto } from '@app/models/product.model';

export const MOCK_PRODUCTS: ProductDto[] = [
  { id: 'p1',  name: 'Urea (46% N)',              sku: 'FERT-001', category: 'Fertilizer', baseUnit: 'Bag (50kg)', hsn: '3102', gstRate: 5,  isActive: true },
  { id: 'p2',  name: 'DAP (18:46:0)',              sku: 'FERT-002', category: 'Fertilizer', baseUnit: 'Bag (50kg)', hsn: '3105', gstRate: 5,  isActive: true },
  { id: 'p3',  name: 'MOP (60% K2O)',              sku: 'FERT-003', category: 'Fertilizer', baseUnit: 'Bag (50kg)', hsn: '3104', gstRate: 5,  isActive: true },
  { id: 'p4',  name: '10:26:26 Complex',           sku: 'FERT-004', category: 'Fertilizer', baseUnit: 'Bag (50kg)', hsn: '3105', gstRate: 5,  isActive: true },
  { id: 'p5',  name: 'Chlorpyrifos 20% EC',        sku: 'PEST-001', category: 'Pesticide',  baseUnit: 'Litre',     hsn: '3808', gstRate: 18, isActive: true,  secondaryUnit: 'Bottle (500ml)', conversionFactor: 2 },
  { id: 'p6',  name: 'Lambda-cyhalothrin 5% EC',   sku: 'PEST-002', category: 'Pesticide',  baseUnit: 'Litre',     hsn: '3808', gstRate: 18, isActive: true,  secondaryUnit: 'Bottle (250ml)', conversionFactor: 4 },
  { id: 'p7',  name: 'Mancozeb 75% WP',            sku: 'PEST-003', category: 'Pesticide',  baseUnit: 'Kg',        hsn: '3808', gstRate: 18, isActive: true },
  { id: 'p8',  name: 'Glyphosate 41% SL',          sku: 'PEST-004', category: 'Pesticide',  baseUnit: 'Litre',     hsn: '3808', gstRate: 18, isActive: false },
  { id: 'p9',  name: 'Paddy HYB-1 (Kharif)',       sku: 'SEED-001', category: 'Seed',       baseUnit: 'Bag (5kg)', hsn: '1006', gstRate: 0,  isActive: true },
  { id: 'p10', name: 'Soybean JS-335',              sku: 'SEED-002', category: 'Seed',       baseUnit: 'Bag (30kg)', hsn: '1201', gstRate: 0, isActive: true },
  { id: 'p11', name: 'Cotton Bt Hybrid',            sku: 'SEED-003', category: 'Seed',       baseUnit: 'Packet',    hsn: '5201', gstRate: 0,  isActive: true },
  { id: 'p12', name: 'Wheat GW-322 (Rabi)',         sku: 'SEED-004', category: 'Seed',       baseUnit: 'Bag (40kg)', hsn: '1001', gstRate: 0, isActive: true },
  { id: 'p13', name: 'Knapsack Sprayer 16L',        sku: 'EQUIP-001', category: 'Equipment', baseUnit: 'Piece',     hsn: '8424', gstRate: 12, isActive: true },
  { id: 'p14', name: 'Soil pH Meter',               sku: 'EQUIP-002', category: 'Equipment', baseUnit: 'Piece',     hsn: '9027', gstRate: 18, isActive: true },
  { id: 'p15', name: 'Micro-nutrient Mix (ZnSO4)', sku: 'FERT-005', category: 'Fertilizer', baseUnit: 'Bag (25kg)', hsn: '3105', gstRate: 5, isActive: true },
];
