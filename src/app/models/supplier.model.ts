export interface SupplierDto {
  id: string;
  name: string;
  code: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  email: string | null;
  gstin: string | null;
  address: string | null;
  creditLimitFromSupplier: number;
  paymentTermsDays: number;
  lastPurchasePrice: number | null;
  lastPurchasedAt: string | null;
  isActive: boolean;
}

export interface SupplierSummaryDto {
  id: string;
  name: string;
  code: string;
  phoneNumber: string | null;
  paymentTermsDays: number;
  isActive: boolean;
  netOutstanding: number;
}

export interface SupplierBalanceDto {
  supplierId: string;
  outstandingAmount: number;
  advanceBalance: number;
  netOutstanding: number;
}

export interface SupplierDtoPagedResult {
  items: SupplierSummaryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateSupplierCommand {
  name: string;
  code: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  email: string | null;
  gstin: string | null;
  address: string | null;
  creditLimitFromSupplier: number;
  paymentTermsDays: number;
  isActive: boolean;
}

export interface UpdateSupplierCommand {
  name: string;
  code: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  email: string | null;
  gstin: string | null;
  address: string | null;
  creditLimitFromSupplier: number;
  paymentTermsDays: number;
  isActive: boolean;
}

export interface SupplierLedgerEntryDto {
  id: string;
  date: string;
  narration: string;
  debitAmount: number | null;
  creditAmount: number | null;
  entryType: SupplierLedgerEntryType;
}

export interface SupplierLedgerPagedResult {
  items: SupplierLedgerEntryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export enum SupplierLedgerEntryType {
  PurchaseInvoiced = 1,
  PaymentMade      = 2,
  DebitNote        = 3,
  ManualDebit      = 4,
  ManualCredit     = 5,
}
