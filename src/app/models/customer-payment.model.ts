export type CustomerPaymentMode = 'Cash' | 'UPI' | 'Cheque' | 'NEFT' | 'IMPS' | 'RTGS' | 'DebitCard';
export type CustomerPaymentStatus = 'Recorded' | 'Verified' | 'PartiallyAllocated' | 'FullyAllocated' | 'Reversed';

export const CUSTOMER_PAYMENT_STATUS_LABELS: Record<CustomerPaymentStatus, string> = {
  Recorded: 'Recorded',
  Verified: 'Verified',
  PartiallyAllocated: 'Partially Allocated',
  FullyAllocated: 'Fully Allocated',
  Reversed: 'Reversed',
};

export const CUSTOMER_PAYMENT_STATUS_BADGE: Record<CustomerPaymentStatus, string> = {
  Recorded: 'neutral',
  Verified: 'info',
  PartiallyAllocated: 'warning',
  FullyAllocated: 'success',
  Reversed: 'danger',
};

export const CUSTOMER_PAYMENT_MODE_LABELS: Record<CustomerPaymentMode, string> = {
  Cash: 'Cash',
  UPI: 'UPI',
  Cheque: 'Cheque',
  NEFT: 'NEFT',
  IMPS: 'IMPS',
  RTGS: 'RTGS',
  DebitCard: 'Debit Card',
};

export interface CustomerPaymentAllocationRow {
  id: string;
  saleRef: string;
  invoiceNumber: string | null;
  saleDate: string;
  allocatedAmount: number;
  allocatedAt: string;
  isReversed: boolean;
  reversalReason: string | null;
}

export interface CustomerPaymentDetailDto {
  id: string;
  paymentRef: string;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  storeName: string;
  status: CustomerPaymentStatus;
  mode: CustomerPaymentMode;
  amountReceived: number;
  amountAllocated: number;
  unallocatedAmount: number;
  paymentDate: string;
  notes: string | null;
  upiTransactionId: string | null;
  upiVpa: string | null;
  chequeNumber: string | null;
  chequeBank: string | null;
  chequeBranch: string | null;
  chequeDate: string | null;
  chequeClearanceDate: string | null;
  chequeBounced: boolean | null;
  neftImpsRef: string | null;
  bankName: string | null;
  valueDate: string | null;
  verifiedAt: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
  allocations: CustomerPaymentAllocationRow[];
}

export interface CustomerPaymentSummaryRow {
  id: string;
  paymentRef: string;
  farmerName: string;
  farmerCode: string;
  mode: CustomerPaymentMode;
  status: CustomerPaymentStatus;
  amountReceived: number;
  unallocatedAmount: number;
  paymentDate: string;
}

export interface OutstandingSaleRow {
  saleId: string;
  saleRef: string;
  invoiceNumber: string | null;
  saleDate: string;
  dueDate: string | null;
  totalAmount: number;
  outstandingAmount: number;
}
