export enum PaymentMode {
  Cash  = 1,
  UPI   = 2,
  Cheque = 3,
  NEFT  = 4,
  RTGS  = 5,
  IMPS  = 6,
}

export const PAYMENT_MODE_LABELS: Record<number, string> = {
  1: 'Cash',
  2: 'UPI',
  3: 'Cheque',
  4: 'NEFT',
  5: 'RTGS',
  6: 'IMPS',
};

export enum SupplierPaymentStatus {
  Recorded           = 1,
  Verified           = 2,
  PartiallyAllocated = 3,
  FullyAllocated     = 4,
  Reversed           = 5,
}

export const SUPPLIER_PAYMENT_STATUS_LABELS: Record<number, string> = {
  1: 'Recorded',
  2: 'Verified',
  3: 'Partially Allocated',
  4: 'Fully Allocated',
  5: 'Reversed',
};

export interface SupplierPaymentAllocationDto {
  id: string;
  purchaseId: string;
  purchaseRef: string;
  supplierInvoiceNumber: string | null;
  allocatedAmount: number;
  allocatedAt: string;
  isReversed: boolean;
  reversalReason: string | null;
}

export interface SupplierPaymentSummaryDto {
  id: string;
  paymentRef: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  mode: PaymentMode;
  status: SupplierPaymentStatus;
  amountPaid: number;
  amountAllocated: number;
  unallocatedAmount: number;
  paymentDate: string;
}

export interface SupplierPaymentSummaryPagedResult {
  items: SupplierPaymentSummaryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SupplierPaymentDetailDto {
  id: string;
  paymentRef: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  amountPaid: number;
  amountAllocated: number;
  unallocatedAmount: number;
  mode: PaymentMode;
  status: SupplierPaymentStatus;
  paymentDate: string;
  notes: string | null;
  // UPI
  upiTransactionId: string | null;
  upiVpa: string | null;
  // Cheque
  chequeNumber: string | null;
  chequeBank: string | null;
  chequeBranch: string | null;
  chequeDate: string | null;
  chequeBounced: boolean | null;
  // NEFT / RTGS / IMPS
  neftImpsRef: string | null;
  bankName: string | null;
  valueDate: string | null;
  // Verification
  verifiedAt: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
  allocations: SupplierPaymentAllocationDto[];
}

export interface RecordCashPaymentCommand {
  supplierId: string;
  storeId: string;
  amountPaid: number;
  paymentDate: string;
  notes: string | null;
}

export interface RecordUpiPaymentCommand extends RecordCashPaymentCommand {
  upiTransactionId: string;
  upiVpa: string | null;
}

export interface RecordChequePaymentCommand extends RecordCashPaymentCommand {
  chequeNumber: string;
  chequeBank: string;
  chequeBranch: string | null;
  chequeDate: string;
}

export interface RecordNeftPaymentCommand extends RecordCashPaymentCommand {
  neftImpsRef: string;
  bankName: string;
  valueDate: string;
}

export interface AllocatePaymentCommand {
  allocations: PaymentAllocationLineCommand[];
}

export interface PaymentAllocationLineCommand {
  purchaseId: string;
  amount: number;
}

export interface BounceOrReverseCommand {
  reason: string;
}

export interface VerifyPaymentCommand {
  clearanceDate: string | null;
}

export interface OutstandingInvoiceDto {
  purchaseId: string;
  purchaseRef: string;
  supplierInvoiceNumber: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  totalAmount: number;
  outstandingAmount: number;
}
