export interface StoreDto {
  id: string;
  tenantId: string;
  tenantName: string | null;
  name: string | null;
  code: string | null;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  isActive: boolean;
  managerName: string | null;
}

export interface StorePagedResult {
  items: StoreDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateStoreCommand {
  tenantId: string | null;
  name: string | null;
  code: string | null;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  managerName: string | null;
}

export interface UpdateStoreCommand {
  id: string;
  tenantId: string | null;
  name: string | null;
  code: string | null;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  isActive: boolean;
  managerName: string | null;
}

export interface StoreListFilters {
  search?: string;
  status?: string;
  tenantId?: string;
  sortBy?: string;
  sortDir?: string;
}
