export type SaleStatus = 'Draft' | 'Confirmed' | 'Invoiced' | 'PartiallyPaid' | 'Paid' | 'Cancelled';
export type SalePaymentMode = 'Cash' | 'Credit' | 'UPI' | 'Mixed';
export type SaleReturnStatus = 'Draft' | 'Confirmed' | 'Credited';

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  Draft: 'Draft',
  Confirmed: 'Confirmed',
  Invoiced: 'Invoiced',
  PartiallyPaid: 'Partially Paid',
  Paid: 'Paid',
  Cancelled: 'Cancelled',
};

export const SALE_STATUS_BADGE: Record<SaleStatus, string> = {
  Draft: 'neutral',
  Confirmed: 'info',
  Invoiced: 'warning',
  PartiallyPaid: 'warning',
  Paid: 'success',
  Cancelled: 'danger',
};

export const SALE_RETURN_STATUS_LABELS: Record<SaleReturnStatus, string> = {
  Draft: 'Draft',
  Confirmed: 'Confirmed',
  Credited: 'Credited',
};

export const SALE_RETURN_STATUS_BADGE: Record<SaleReturnStatus, string> = {
  Draft: 'neutral',
  Confirmed: 'info',
  Credited: 'success',
};

export interface SaleItemRow {
  id: string;
  productId: string;
  productName: string;
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
}

export interface SaleAllocationRow {
  paymentRef: string;
  paymentDate: string;
  mode: string;
  allocatedAmount: number;
  isReversed: boolean;
}

export interface SaleDetailDto {
  id: string;
  saleRef: string;
  invoiceNumber: string | null;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  storeName: string;
  status: SaleStatus;
  paymentMode: SalePaymentMode;
  creditDays: number;
  saleDate: string;
  dueDate: string | null;
  invoicedAt: string | null;
  seasonName: string;
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
  items: SaleItemRow[];
  allocations: SaleAllocationRow[];
}

export interface SaleSummaryRow {
  id: string;
  saleRef: string;
  farmerName: string;
  farmerCode: string;
  saleDate: string;
  paymentMode: SalePaymentMode;
  status: SaleStatus;
  totalAmount: number;
  outstandingAmount: number;
}

export interface SaleReturnItemRow {
  id: string;
  productName: string;
  unitName: string;
  quantity: number;
  ratePerUnit: number;
  taxableAmount: number;
  taxRatePercent: number;
  lineTotal: number;
}

export interface SaleReturnDetailDto {
  id: string;
  creditNoteNumber: string;
  saleId: string;
  saleRef: string;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  storeName: string;
  status: SaleReturnStatus;
  returnDate: string;
  reason: string;
  totalAmount: number;
  confirmedAt: string | null;
  creditedAt: string | null;
  items: SaleReturnItemRow[];
}

export interface SaleReturnSummaryRow {
  id: string;
  creditNoteNumber: string;
  saleRef: string;
  farmerName: string;
  farmerCode: string;
  returnDate: string;
  reason: string;
  totalAmount: number;
  status: SaleReturnStatus;
}
