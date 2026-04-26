export interface UserProfile {
  userId: string;
  email: string;
  tenantId: string;
  userType: string;
  staffRole: string | null;
  storeIds: string[];
}
