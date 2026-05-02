export interface BatchDto {
  id: string;
  batchNumber: string;
  productName: string;
  supplierName: string;
  expiryDate: string;
  quantityAvailableInBase: number;
  costPricePerUnit: number;
  isActive: boolean;
}

export interface BatchPagedResult {
  items: BatchDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
