import {
  InventoryLedgerEntryDto,
  LowStockItemDto,
  ProductStoreThresholdDto,
  StockAdjustmentDto,
  StockBalanceDto,
  StockTransferDto,
} from '@app/models/inventory.model';

export const MOCK_STOCK: StockBalanceDto[] = [
  { productId: 'p1',  productName: 'Urea (46% N)',            sku: 'FERT-001', category: 'Fertilizer', storeId: 's1', storeName: 'Nagpur Main',    quantityInBase: 120, reservedQuantity: 20,  availableQuantity: 100, baseUnit: 'Bag (50kg)', reorderLevel: 50,  stockStatus: 'ok',  weightedAverageCost: 1380, lastUpdated: '2026-05-07' },
  { productId: 'p2',  productName: 'DAP (18:46:0)',           sku: 'FERT-002', category: 'Fertilizer', storeId: 's1', storeName: 'Nagpur Main',    quantityInBase: 35,  reservedQuantity: 0,   availableQuantity: 35,  baseUnit: 'Bag (50kg)', reorderLevel: 40,  stockStatus: 'low', weightedAverageCost: 1750, lastUpdated: '2026-05-06' },
  { productId: 'p3',  productName: 'MOP (60% K2O)',           sku: 'FERT-003', category: 'Fertilizer', storeId: 's1', storeName: 'Nagpur Main',    quantityInBase: 0,   reservedQuantity: 0,   availableQuantity: 0,   baseUnit: 'Bag (50kg)', reorderLevel: 20,  stockStatus: 'out', weightedAverageCost: 1250, lastUpdated: '2026-05-04' },
  { productId: 'p5',  productName: 'Chlorpyrifos 20% EC',     sku: 'PEST-001', category: 'Pesticide',  storeId: 's1', storeName: 'Nagpur Main',    quantityInBase: 85,  reservedQuantity: 10,  availableQuantity: 75,  baseUnit: 'Litre',     reorderLevel: 30,  stockStatus: 'ok',  weightedAverageCost: 420,  lastUpdated: '2026-05-07' },
  { productId: 'p9',  productName: 'Paddy HYB-1 (Kharif)',    sku: 'SEED-001', category: 'Seed',       storeId: 's1', storeName: 'Nagpur Main',    quantityInBase: 18,  reservedQuantity: 5,   availableQuantity: 13,  baseUnit: 'Bag (5kg)', reorderLevel: 25,  stockStatus: 'low', weightedAverageCost: 2200, lastUpdated: '2026-05-05' },
  { productId: 'p10', productName: 'Soybean JS-335',           sku: 'SEED-002', category: 'Seed',       storeId: 's1', storeName: 'Nagpur Main',    quantityInBase: 60,  reservedQuantity: 0,   availableQuantity: 60,  baseUnit: 'Bag (30kg)',reorderLevel: 20,  stockStatus: 'ok',  weightedAverageCost: 3800, lastUpdated: '2026-05-06' },
  { productId: 'p1',  productName: 'Urea (46% N)',            sku: 'FERT-001', category: 'Fertilizer', storeId: 's2', storeName: 'Wardha Hub',     quantityInBase: 80,  reservedQuantity: 0,   availableQuantity: 80,  baseUnit: 'Bag (50kg)', reorderLevel: 30,  stockStatus: 'ok',  weightedAverageCost: 1380, lastUpdated: '2026-05-07' },
  { productId: 'p4',  productName: '10:26:26 Complex',        sku: 'FERT-004', category: 'Fertilizer', storeId: 's2', storeName: 'Wardha Hub',     quantityInBase: 12,  reservedQuantity: 0,   availableQuantity: 12,  baseUnit: 'Bag (50kg)', reorderLevel: 20,  stockStatus: 'low', weightedAverageCost: 1620, lastUpdated: '2026-05-05' },
  { productId: 'p6',  productName: 'Lambda-cyhalothrin 5% EC',sku: 'PEST-002', category: 'Pesticide',  storeId: 's2', storeName: 'Wardha Hub',     quantityInBase: 55,  reservedQuantity: 0,   availableQuantity: 55,  baseUnit: 'Litre',     reorderLevel: 20,  stockStatus: 'ok',  weightedAverageCost: 380,  lastUpdated: '2026-05-06' },
  { productId: 'p11', productName: 'Cotton Bt Hybrid',        sku: 'SEED-003', category: 'Seed',       storeId: 's2', storeName: 'Wardha Hub',     quantityInBase: 0,   reservedQuantity: 0,   availableQuantity: 0,   baseUnit: 'Packet',    reorderLevel: 50,  stockStatus: 'out', weightedAverageCost: 960,  lastUpdated: '2026-04-30' },
  { productId: 'p13', productName: 'Knapsack Sprayer 16L',    sku: 'EQUIP-001', category: 'Equipment', storeId: 's2', storeName: 'Wardha Hub',     quantityInBase: 22,  reservedQuantity: 2,   availableQuantity: 20,  baseUnit: 'Piece',     reorderLevel: 10,  stockStatus: 'ok',  weightedAverageCost: 840,  lastUpdated: '2026-05-01' },
  { productId: 'p2',  productName: 'DAP (18:46:0)',           sku: 'FERT-002', category: 'Fertilizer', storeId: 's3', storeName: 'Amravati Point', quantityInBase: 95,  reservedQuantity: 30,  availableQuantity: 65,  baseUnit: 'Bag (50kg)', reorderLevel: 40,  stockStatus: 'ok',  weightedAverageCost: 1750, lastUpdated: '2026-05-07' },
  { productId: 'p7',  productName: 'Mancozeb 75% WP',        sku: 'PEST-003', category: 'Pesticide',  storeId: 's3', storeName: 'Amravati Point', quantityInBase: 8,   reservedQuantity: 0,   availableQuantity: 8,   baseUnit: 'Kg',        reorderLevel: 15,  stockStatus: 'low', weightedAverageCost: 290,  lastUpdated: '2026-05-03' },
  { productId: 'p9',  productName: 'Paddy HYB-1 (Kharif)',    sku: 'SEED-001', category: 'Seed',       storeId: 's3', storeName: 'Amravati Point', quantityInBase: 42,  reservedQuantity: 10,  availableQuantity: 32,  baseUnit: 'Bag (5kg)', reorderLevel: 25,  stockStatus: 'ok',  weightedAverageCost: 2200, lastUpdated: '2026-05-07' },
  { productId: 'p15', productName: 'Micro-nutrient Mix',      sku: 'FERT-005', category: 'Fertilizer', storeId: 's3', storeName: 'Amravati Point', quantityInBase: 3,   reservedQuantity: 0,   availableQuantity: 3,   baseUnit: 'Bag (25kg)', reorderLevel: 10, stockStatus: 'low', weightedAverageCost: 620,  lastUpdated: '2026-05-02' },
];

export const MOCK_ADJUSTMENTS: StockAdjustmentDto[] = [
  { id: 'adj-001', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p2',  productName: 'DAP (18:46:0)',        adjustmentType: 'PhysicalCount',    systemQty: 38,  physicalQty: 35,  differenceQty: -3,  unit: 'Bag (50kg)', reason: 'Physical count variance found during weekly audit',                  status: 'PendingApproval', createdBy: 'Rahul Sharma',  createdAt: '2026-05-07T09:15:00' },
  { id: 'adj-002', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p3',  productName: 'MOP (60% K2O)',        adjustmentType: 'Damage',           systemQty: 5,   physicalQty: 0,   differenceQty: -5,  unit: 'Bag (50kg)', reason: 'Bags torn in warehouse — water seepage from roof during rain',        status: 'PendingApproval', createdBy: 'Priya Desai',   createdAt: '2026-05-06T14:30:00' },
  { id: 'adj-003', storeId: 's2', storeName: 'Wardha Hub',     productId: 'p4',  productName: '10:26:26 Complex',     adjustmentType: 'ManualCorrection', systemQty: 10,  physicalQty: 12,  differenceQty: 2,   unit: 'Bag (50kg)', reason: 'Entry error in previous receipt',                                     status: 'Approved',        createdBy: 'Suresh Patil',  createdAt: '2026-05-05T11:00:00', approvedBy: 'Manager A', approvedAt: '2026-05-05T15:00:00' },
  { id: 'adj-004', storeId: 's3', storeName: 'Amravati Point', productId: 'p7',  productName: 'Mancozeb 75% WP',     adjustmentType: 'Damage',           systemQty: 12,  physicalQty: 8,   differenceQty: -4,  unit: 'Kg',         reason: 'Packaging failure — powder leakage in storage area',                 status: 'Approved',        createdBy: 'Kavita Nair',   createdAt: '2026-05-03T08:45:00', approvedBy: 'Manager B', approvedAt: '2026-05-03T13:00:00' },
  { id: 'adj-005', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p5',  productName: 'Chlorpyrifos 20% EC', adjustmentType: 'PhysicalCount',    systemQty: 90,  physicalQty: 85,  differenceQty: -5,  unit: 'Litre',      reason: 'Count after relabelling exercise',                                    status: 'Approved',        createdBy: 'Rahul Sharma',  createdAt: '2026-05-01T10:00:00', approvedBy: 'Manager A', approvedAt: '2026-05-01T16:00:00' },
  { id: 'adj-006', storeId: 's2', storeName: 'Wardha Hub',     productId: 'p11', productName: 'Cotton Bt Hybrid',    adjustmentType: 'Damage',           systemQty: 30,  physicalQty: 0,   differenceQty: -30, unit: 'Packet',     reason: 'Entire stock expired — beyond seed viability date, consignment condemned', status: 'Approved',  createdBy: 'Suresh Patil',  createdAt: '2026-04-29T09:00:00', approvedBy: 'Manager A', approvedAt: '2026-04-30T10:00:00' },
  { id: 'adj-007', storeId: 's3', storeName: 'Amravati Point', productId: 'p15', productName: 'Micro-nutrient Mix',  adjustmentType: 'PhysicalCount',    systemQty: 5,   physicalQty: 3,   differenceQty: -2,  unit: 'Bag (25kg)', reason: undefined,                                                             status: 'PendingApproval', createdBy: 'Meena Kulkarni', createdAt: '2026-05-07T11:30:00' },
  { id: 'adj-008', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p9',  productName: 'Paddy HYB-1 (Kharif)',adjustmentType: 'ManualCorrection', systemQty: 20,  physicalQty: 18,  differenceQty: -2,  unit: 'Bag (5kg)', reason: 'Correcting typo in original stock entry',                             status: 'Rejected',        createdBy: 'Priya Desai',   createdAt: '2026-04-28T14:00:00', rejectedBy: 'Manager A', rejectedAt: '2026-04-28T17:00:00', rejectionReason: 'Reason insufficient — please recount and resubmit with photos' },
  { id: 'adj-009', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p1',  productName: 'Urea (46% N)',         adjustmentType: 'ManualCorrection', systemQty: 115, physicalQty: 120, differenceQty: 5,   unit: 'Bag (50kg)', reason: 'Unlogged receipt found — verified against delivery challan',          status: 'Approved',        createdBy: 'Rahul Sharma',  createdAt: '2026-04-25T09:30:00', approvedBy: 'Manager A', approvedAt: '2026-04-25T14:00:00' },
  { id: 'adj-010', storeId: 's3', storeName: 'Amravati Point', productId: 'p2',  productName: 'DAP (18:46:0)',        adjustmentType: 'PhysicalCount',    systemQty: 90,  physicalQty: 95,  differenceQty: 5,   unit: 'Bag (50kg)', reason: 'Found additional stock in back storage',                              status: 'Draft',           createdBy: 'Meena Kulkarni', createdAt: '2026-05-08T08:00:00' },
];

export const MOCK_TRANSFERS: StockTransferDto[] = [
  {
    id: 'tr-001', fromStoreId: 's1', fromStoreName: 'Nagpur Main', toStoreId: 's2', toStoreName: 'Wardha Hub',
    status: 'Received', createdBy: 'Rahul Sharma', createdAt: '2026-04-25T10:00:00',
    items: [
      { id: 'tri-1', productId: 'p1', productName: 'Urea (46% N)', unit: 'Bag (50kg)', requestedQty: 30, dispatchedQty: 30, receivedQty: 30 },
      { id: 'tri-2', productId: 'p2', productName: 'DAP (18:46:0)', unit: 'Bag (50kg)', requestedQty: 20, dispatchedQty: 20, receivedQty: 20 },
    ],
  },
  {
    id: 'tr-002', fromStoreId: 's1', fromStoreName: 'Nagpur Main', toStoreId: 's3', toStoreName: 'Amravati Point',
    status: 'InTransit', createdBy: 'Priya Desai', createdAt: '2026-05-06T09:30:00', notes: 'Urgent — low stock at Amravati',
    items: [
      { id: 'tri-3', productId: 'p5', productName: 'Chlorpyrifos 20% EC', unit: 'Litre', requestedQty: 20, dispatchedQty: 20 },
      { id: 'tri-4', productId: 'p9', productName: 'Paddy HYB-1 (Kharif)', unit: 'Bag (5kg)', requestedQty: 10, dispatchedQty: 10 },
    ],
  },
  {
    id: 'tr-003', fromStoreId: 's2', fromStoreName: 'Wardha Hub', toStoreId: 's3', toStoreName: 'Amravati Point',
    status: 'PendingApproval', createdBy: 'Suresh Patil', createdAt: '2026-05-07T14:00:00',
    items: [
      { id: 'tri-5', productId: 'p6', productName: 'Lambda-cyhalothrin 5% EC', unit: 'Litre', requestedQty: 15 },
    ],
  },
  {
    id: 'tr-004', fromStoreId: 's3', fromStoreName: 'Amravati Point', toStoreId: 's1', toStoreName: 'Nagpur Main',
    status: 'Approved', createdBy: 'Meena Kulkarni', createdAt: '2026-05-07T16:00:00',
    items: [
      { id: 'tri-6', productId: 'p2', productName: 'DAP (18:46:0)', unit: 'Bag (50kg)', requestedQty: 20 },
      { id: 'tri-7', productId: 'p15', productName: 'Micro-nutrient Mix', unit: 'Bag (25kg)', requestedQty: 5 },
    ],
  },
  {
    id: 'tr-005', fromStoreId: 's1', fromStoreName: 'Nagpur Main', toStoreId: 's2', toStoreName: 'Wardha Hub',
    status: 'PartiallyReceived', createdBy: 'Rahul Sharma', createdAt: '2026-05-01T08:00:00',
    items: [
      { id: 'tri-8', productId: 'p10', productName: 'Soybean JS-335', unit: 'Bag (30kg)', requestedQty: 20, dispatchedQty: 20, receivedQty: 12 },
      { id: 'tri-9', productId: 'p13', productName: 'Knapsack Sprayer 16L', unit: 'Piece', requestedQty: 5, dispatchedQty: 5, receivedQty: 5 },
    ],
  },
  {
    id: 'tr-006', fromStoreId: 's2', fromStoreName: 'Wardha Hub', toStoreId: 's1', toStoreName: 'Nagpur Main',
    status: 'Cancelled', createdBy: 'Suresh Patil', createdAt: '2026-04-20T11:00:00',
    items: [
      { id: 'tri-10', productId: 'p4', productName: '10:26:26 Complex', unit: 'Bag (50kg)', requestedQty: 10 },
    ],
  },
  {
    id: 'tr-007', fromStoreId: 's1', fromStoreName: 'Nagpur Main', toStoreId: 's3', toStoreName: 'Amravati Point',
    status: 'Draft', createdBy: 'Priya Desai', createdAt: '2026-05-08T07:30:00',
    items: [],
  },
];

export const MOCK_THRESHOLDS: ProductStoreThresholdDto[] = [
  { id: 'th-01', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p1',  productName: 'Urea (46% N)',            reorderLevel: 50,  reorderQty: 100, preferredSupplierName: 'Chambal Fertilisers',  isActive: true },
  { id: 'th-02', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p2',  productName: 'DAP (18:46:0)',           reorderLevel: 40,  reorderQty: 80,  preferredSupplierName: 'IFFCO',                isActive: true },
  { id: 'th-03', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p3',  productName: 'MOP (60% K2O)',           reorderLevel: 20,  reorderQty: 50,  preferredSupplierName: 'IPL',                  isActive: true },
  { id: 'th-04', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p9',  productName: 'Paddy HYB-1 (Kharif)',   reorderLevel: 25,  reorderQty: 50,  preferredSupplierName: 'Advanta Seeds',        isActive: true },
  { id: 'th-05', storeId: 's2', storeName: 'Wardha Hub',     productId: 'p4',  productName: '10:26:26 Complex',       reorderLevel: 20,  reorderQty: 40,  preferredSupplierName: 'IFFCO',                isActive: true },
  { id: 'th-06', storeId: 's2', storeName: 'Wardha Hub',     productId: 'p11', productName: 'Cotton Bt Hybrid',       reorderLevel: 50,  reorderQty: 100, preferredSupplierName: 'Mahyco Seeds',         isActive: true },
  { id: 'th-07', storeId: 's3', storeName: 'Amravati Point', productId: 'p7',  productName: 'Mancozeb 75% WP',       reorderLevel: 15,  reorderQty: 30,  preferredSupplierName: 'Dhanuka Agritech',     isActive: true },
  { id: 'th-08', storeId: 's3', storeName: 'Amravati Point', productId: 'p15', productName: 'Micro-nutrient Mix',    reorderLevel: 10,  reorderQty: 25,  preferredSupplierName: undefined,              isActive: true },
  { id: 'th-09', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p5',  productName: 'Chlorpyrifos 20% EC',   reorderLevel: 30,  reorderQty: 60,  preferredSupplierName: 'Dhanuka Agritech',     isActive: true },
  { id: 'th-10', storeId: 's2', storeName: 'Wardha Hub',     productId: 'p1',  productName: 'Urea (46% N)',            reorderLevel: 30,  reorderQty: 80,  preferredSupplierName: 'Chambal Fertilisers',  isActive: false },
  { id: 'th-11', storeId: 's3', storeName: 'Amravati Point', productId: 'p9',  productName: 'Paddy HYB-1 (Kharif)',  reorderLevel: 25,  reorderQty: 50,  preferredSupplierName: 'Advanta Seeds',        isActive: true },
  { id: 'th-12', storeId: 's1', storeName: 'Nagpur Main',    productId: 'p10', productName: 'Soybean JS-335',         reorderLevel: 20,  reorderQty: 40,  preferredSupplierName: 'Ankur Seeds',          isActive: true },
];

export const MOCK_LEDGER_ENTRIES: InventoryLedgerEntryDto[] = [
  { id: 'led-01', date: '2026-05-07', entryType: 'PurchaseReceive',  quantity: 50,  unit: 'Bag (50kg)', reference: 'PUR-0042', notes: 'Received from IFFCO' },
  { id: 'led-02', date: '2026-05-06', entryType: 'SaleIssue',        quantity: -10, unit: 'Bag (50kg)', reference: 'SALE-0211', notes: undefined },
  { id: 'led-03', date: '2026-05-05', entryType: 'SaleIssue',        quantity: -8,  unit: 'Bag (50kg)', reference: 'SALE-0208', notes: undefined },
  { id: 'led-04', date: '2026-05-03', entryType: 'TransferIn',       quantity: 30,  unit: 'Bag (50kg)', reference: 'TR-001',    notes: 'From Wardha Hub' },
  { id: 'led-05', date: '2026-05-01', entryType: 'AdjustmentUp',     quantity: 5,   unit: 'Bag (50kg)', reference: 'ADJ-009',   notes: 'Unlogged receipt correction' },
  { id: 'led-06', date: '2026-04-28', entryType: 'SaleIssue',        quantity: -15, unit: 'Bag (50kg)', reference: 'SALE-0195', notes: undefined },
  { id: 'led-07', date: '2026-04-25', entryType: 'PurchaseReceive',  quantity: 80,  unit: 'Bag (50kg)', reference: 'PUR-0039', notes: 'Received from Chambal Fertilisers' },
  { id: 'led-08', date: '2026-04-22', entryType: 'SaleIssue',        quantity: -12, unit: 'Bag (50kg)', reference: 'SALE-0182', notes: undefined },
  { id: 'led-09', date: '2026-04-20', entryType: 'TransferOut',      quantity: -20, unit: 'Bag (50kg)', reference: 'TR-006',    notes: 'To Nagpur Main (cancelled)' },
  { id: 'led-10', date: '2026-04-18', entryType: 'SaleIssue',        quantity: -6,  unit: 'Bag (50kg)', reference: 'SALE-0175', notes: undefined },
];

export const MOCK_LOW_STOCK: LowStockItemDto[] = MOCK_STOCK
  .filter(s => s.stockStatus !== 'ok')
  .map(s => ({
    productId: s.productId,
    productName: s.productName,
    sku: s.sku,
    storeId: s.storeId,
    storeName: s.storeName,
    currentStock: s.availableQuantity,
    reorderLevel: s.reorderLevel ?? 0,
    shortage: (s.reorderLevel ?? 0) - s.availableQuantity,
    unit: s.baseUnit,
    preferredSupplier: MOCK_THRESHOLDS.find(t => t.productId === s.productId && t.storeId === s.storeId)?.preferredSupplierName,
    reorderQty: MOCK_THRESHOLDS.find(t => t.productId === s.productId && t.storeId === s.storeId)?.reorderQty,
  }));
