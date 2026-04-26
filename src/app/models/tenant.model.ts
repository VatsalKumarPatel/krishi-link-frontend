export interface TenantDto {
  id: string;
  name: string | null;
  slug: string | null;
  gstin: string | null;
  pan: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  isActive: boolean;
  subscriptionExpiresAt: string | null;
  storeCount: number;
}

export interface TenantPagedResult {
  items: TenantDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateTenantCommand {
  name: string | null;
  slug: string | null;
  gstin: string | null;
  pan: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  subscriptionExpiresAt: string | null;
}

export interface UpdateTenantCommand {
  id: string;
  name: string | null;
  gstin: string | null;
  pan: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  isActive: boolean;
  subscriptionExpiresAt: string | null;
}

export interface ActivityLogDto {
  id: string;
  eventType: string | null;
  module: string | null;
  primaryEntityType: string | null;
  primaryEntityId: string;
  referenceNumber: string | null;
  description: string | null;
  actorId: string;
  actorName: string | null;
  createdAt: string;
  extraData: string | null;
  navigationUrl: string | null;
  linkedEntities: { entityType: string | null; entityId: string }[] | null;
}

export interface AdminStoreDtoForTenant {
  id: string;
  tenantId: string;
  tenantName: string | null;
  name: string | null;
  code: string | null;
  gstin: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  isActive: boolean;
}

export interface AdminStorePagedResult {
  items: AdminStoreDtoForTenant[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TenantListFilters {
  search?: string;
  status?: string;    // 'Active' | 'Inactive' — omit for All
  sortBy?: string;
  sortDir?: string;   // 'asc' | 'desc'
}
