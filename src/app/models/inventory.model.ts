export type StockStatus = 'ok' | 'low' | 'out';

export type AdjustmentType = 'ManualCorrection' | 'PhysicalCount' | 'Damage';

export type AdjustmentStatus = 'Draft' | 'PendingApproval' | 'Approved' | 'Rejected';

export type TransferStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Approved'
  | 'InTransit'
  | 'PartiallyReceived'
  | 'Received'
  | 'Cancelled';

export interface StockBalanceDto {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  storeId: string;
  storeName: string;
  quantityInBase: number;
  reservedQuantity: number;
  availableQuantity: number;
  baseUnit: string;
  reorderLevel?: number;
  stockStatus: StockStatus;
  weightedAverageCost: number;
  lastUpdated: string;
}

export interface StockAdjustmentDto {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  adjustmentType: AdjustmentType;
  systemQty: number;
  physicalQty: number;
  differenceQty: number;
  unit: string;
  reason?: string;
  status: AdjustmentStatus;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface StockTransferItemDto {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  requestedQty: number;
  dispatchedQty?: number;
  receivedQty?: number;
}

export interface StockTransferDto {
  id: string;
  fromStoreId: string;
  fromStoreName: string;
  toStoreId: string;
  toStoreName: string;
  status: TransferStatus;
  items: StockTransferItemDto[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface ProductStoreThresholdDto {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  reorderLevel: number;
  reorderQty?: number;
  preferredSupplierName?: string;
  isActive: boolean;
}

export interface InventoryLedgerEntryDto {
  id: string;
  date: string;
  entryType: string;
  quantity: number;
  unit: string;
  reference: string;
  notes?: string;
}

export interface LowStockItemDto {
  productId: string;
  productName: string;
  sku: string;
  storeId: string;
  storeName: string;
  currentStock: number;
  reorderLevel: number;
  shortage: number;
  unit: string;
  preferredSupplier?: string;
  reorderQty?: number;
}
