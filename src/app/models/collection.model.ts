export interface CollectionQueueItem {
  rank: number;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  outstanding: number;
  oldestDueDays: number;
  lastContactDate: string | null;
  lastContactNote: string | null;
  harvestMonth: string | null;
  priorityScore: number;
}

export interface UnpaidSale {
  saleRef: string;
  date: string;
  total: number;
  paid: number;
  outstanding: number;
  ageDays: number;
}

export interface LedgerEntry {
  date: string;
  description: string;
  amount: number;
  type: 'payment' | 'sale';
}

export interface CollectionNote {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  hasTodo: boolean;
  todoDate: string | null;
}

export interface FarmerOutstandingDetail {
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  village: string;
  totalOutstanding: number;
  oldestDueDays: number;
  lastPaymentAmount: number | null;
  lastPaymentDate: string | null;
  lastContactNote: string | null;
  lastContactDate: string | null;
  lastContactBy: string | null;
  harvestMonth: string | null;
  priorityScore: number;
  ageFactor: number;
  harvestFactor: number;
  unpaidSales: UnpaidSale[];
  recentPayments: LedgerEntry[];
  activityNotes: CollectionNote[];
}

export interface CollectionTarget {
  id: string;
  targetType: 'Daily' | 'Weekly';
  targetAmount: number;
  amountCollected: number;
  periodStart: string;
  periodEnd: string;
  isActive: boolean;
}
