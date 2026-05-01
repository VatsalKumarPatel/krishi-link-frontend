export enum PurchaseReturnStatus {
  Draft       = 1,
  Dispatched  = 2,
  Acknowledged = 3,
}

export const RETURN_STATUS_LABELS: Record<number, string> = {
  1: 'Draft',
  2: 'Dispatched',
  3: 'Acknowledged',
};

export interface PurchaseReturnItemDto {
  id: string;
  productId: string;
  productName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  ratePerUnit: number;
  taxableAmount: number;
  taxRatePercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotal: number;
  batchId: string | null;
  batchNumber: string | null;
}

export interface PurchaseReturnSummaryDto {
  id: string;
  debitNoteNumber: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  purchaseId: string | null;
  purchaseRef: string | null;
  returnDate: string;
  status: PurchaseReturnStatus;
  totalAmount: number;
  reason: string;
}

export interface PurchaseReturnSummaryPagedResult {
  items: PurchaseReturnSummaryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PurchaseReturnDetailDto {
  id: string;
  debitNoteNumber: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  purchaseId: string | null;
  purchaseRef: string | null;
  returnDate: string;
  reason: string;
  status: PurchaseReturnStatus;
  totalAmount: number;
  dispatchedAt: string | null;
  acknowledgedAt: string | null;
  items: PurchaseReturnItemDto[];
}

export interface CreatePurchaseReturnCommand {
  supplierId: string;
  storeId: string;
  purchaseId: string | null;
  returnDate: string;
  reason: string;
  items: CreateReturnItemCommand[];
}

export interface CreateReturnItemCommand {
  productId: string;
  unitId: string;
  quantity: number;
  ratePerUnit: number;
  hsnCode: string;
  taxRatePercent: number;
  batchId: string | null;
}

export interface DispatchReturnCommand {
  dispatchedAt: string;
}
