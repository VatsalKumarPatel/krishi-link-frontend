export type ProductCategory = 'Fertilizer' | 'Pesticide' | 'Seed' | 'Equipment' | 'Other';

export interface ProductDto {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  baseUnit: string;
  secondaryUnit?: string;
  conversionFactor?: number;
  hsn?: string;
  gstRate: number;
  isActive: boolean;
}

export interface CreateProductCommand {
  name: string;
  sku: string;
  category: ProductCategory;
  baseUnit: string;
  secondaryUnit?: string;
  conversionFactor?: number;
  hsn?: string;
  gstRate: number;
}

export interface UpdateProductCommand extends CreateProductCommand {
  isActive: boolean;
}
