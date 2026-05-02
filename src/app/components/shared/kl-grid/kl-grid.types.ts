import { BadgeVariant } from '../badge/badge.component';

export type GridColumnType = 'text' | 'badge' | 'date';

export interface GridColumn {
  field: string;
  header: string;
  sortable?: boolean;
  isCustomTemplate?: boolean;
  type?: GridColumnType;
  badgeVariant?: BadgeVariant | ((value: any, row: any) => BadgeVariant);
  dateFormat?: string;
}
