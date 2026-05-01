export enum PurchaseStatus {
  Draft          = 1,
  Received       = 2,
  Invoiced       = 3,
  PartiallyPaid  = 4,
  Paid           = 5,
  Cancelled      = 6,
}

export const PURCHASE_STATUS_LABELS: Record<number, string> = {
  1: 'Draft',
  2: 'Received',
  3: 'Invoiced',
  4: 'Partially Paid',
  5: 'Paid',
  6: 'Cancelled',
};

export type PurchaseStatusBadge = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

export const PURCHASE_STATUS_BADGE: Record<number, PurchaseStatusBadge> = {
  1: 'neutral',
  2: 'info',
  3: 'warning',
  4: 'warning',
  5: 'success',
  6: 'danger',
};

export interface PurchaseSummaryDto {
  id: string;
  purchaseRef: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  status: PurchaseStatus;
  purchaseDate: string;
  dueDate: string | null;
  totalAmount: number;
  outstandingAmount: number;
}

export interface PurchaseSummaryPagedResult {
  items: PurchaseSummaryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PurchaseItemDto {
  id: string;
  productId: string;
  productName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  ratePerUnit: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  hsnCode: string;
  taxRatePercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotal: number;
  batchId: string | null;
  batchNumber: string | null;
  expiryDate: string | null;
}

export interface PurchaseAllocationDto {
  id: string;
  supplierPaymentId: string;
  paymentRef: string;
  allocatedAmount: number;
  allocatedAt: string;
  isReversed: boolean;
  reversalReason: string | null;
}

export interface PurchaseDetailDto {
  id: string;
  purchaseRef: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  status: PurchaseStatus;
  purchaseDate: string;
  invoiceDate: string | null;
  supplierInvoiceNumber: string | null;
  dueDate: string | null;
  sellerGstin: string | null;
  buyerGstin: string | null;
  placeOfSupply: string | null;
  isInterState: boolean;
  subTotal: number;
  totalDiscount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalAmount: number;
  allocatedAmount: number;
  outstandingAmount: number;
  notes: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  items: PurchaseItemDto[];
  allocations: PurchaseAllocationDto[];
}

export interface CreatePurchaseCommand {
  supplierId: string;
  storeId: string;
  purchaseDate: string;
  notes: string | null;
}

export interface AddPurchaseItemCommand {
  productId: string;
  unitId: string;
  quantity: number;
  ratePerUnit: number;
  discountPercent: number;
  hsnCode: string;
  taxRatePercent: number;
  batchNumber: string | null;
  expiryDate: string | null;
}

export interface ReceiveAndInvoiceCommand {
  supplierInvoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  sellerGstin: string | null;
  buyerGstin: string | null;
  placeOfSupply: string;
  isInterState: boolean;
}

export interface ReceiveStockCommand {
  receivedAt: string;
}

export interface CancelPurchaseCommand {
  reason: string;
}

export interface PurchaseListFilters {
  supplierId?: string;
  storeId?: string;
  status?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}
