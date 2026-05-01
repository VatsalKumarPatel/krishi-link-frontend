export interface FarmerDto {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  village: string | null;
  taluka: string | null;
  district: string | null;
  kccNumber: string | null;
  landAreaAcres: number | null;
  primaryCrop: string | null;
  preferredSeason: string | null;
  aadhaarNumber: string | null;
}

export interface FarmerDtoPagedResult {
  items: FarmerDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RegisterFarmerCommand {
  name: string | null;
  email: string | null;
  phone: string | null;
  village: string | null;
  taluka: string | null;
  district: string | null;
  kccNumber: string | null;
  landAreaAcres: number | null;
  primaryCrop: string | null;
  preferredSeason: Season | null;
  aadhaarNumber: string | null;
}

export interface UpdateFarmerCommand {
  id: string;
  name: string | null;
  phone: string | null;
  isActive: boolean;
  village: string | null;
  taluka: string | null;
  district: string | null;
  kccNumber: string | null;
  landAreaAcres: number | null;
  primaryCrop: string | null;
  preferredSeason: Season | null;
  aadhaarNumber: string | null;
}

/** Season integer enum used in commands (1=Kharif, 2=Rabi, 3=Zaid) */
export enum Season {
  Kharif = 1,
  Rabi   = 2,
  Zaid   = 3,
}

export const SEASON_LABELS: Record<number, string> = {
  1: 'Kharif',
  2: 'Rabi',
  3: 'Zaid',
};
