import { BadgeVariant } from '../../shared/badge/badge.component';
import type { FeedItem, FeedGroup } from '../../shared/kl-activity-feed/kl-activity-feed.component';

export interface Farmer {
  id: string; name: string; region: string; store: string;
  crop: string; area: number; status: FarmerStatus;
  updated: string; phone: string; joined: string; coop: string; plots: number;
}

export interface Plot {
  code: string; crop: string; area: number;
  sowing: string; harvest: string; stage: PlotStage; health: PlotHealth;
}

export type FarmerStatus = 'Active' | 'Needs review' | 'Overdue' | 'Draft';
export type PlotStage = 'Vegetative' | 'Flowering' | 'Harvesting' | 'Harvested' | 'Draft' | 'Plucking';
export type PlotHealth = 'Excellent' | 'Good' | 'Fair' | 'Poor' | '—';

export const STATUS_VARIANT: Record<FarmerStatus, BadgeVariant> = {
  'Active': 'success', 'Needs review': 'warning', 'Overdue': 'danger', 'Draft': 'neutral',
};

export const STAGE_VARIANT: Record<PlotStage, BadgeVariant> = {
  'Vegetative': 'success', 'Flowering': 'info', 'Harvesting': 'warning',
  'Harvested': 'neutral', 'Draft': 'neutral', 'Plucking': 'info',
};

export const HEALTH_VARIANT: Record<PlotHealth, BadgeVariant> = {
  'Excellent': 'success', 'Good': 'success', 'Fair': 'warning', 'Poor': 'danger', '—': 'neutral',
};

export const FARMERS: Farmer[] = [
  { id: 'KL-0442', name: 'Bishal Tamang',  region: 'Chitwan',   store: 'Bharatpur Hub',    crop: 'Rice',      area: 2.4, status: 'Active',       updated: '2m ago',    phone: '+977 98-4211-0042', joined: 'Mar 14, 2024', coop: 'Terai Fields Co-op',    plots: 3 },
  { id: 'KL-0441', name: 'Sunita Poudel',  region: 'Kaski',     store: 'Pokhara Depot',    crop: 'Maize',     area: 1.1, status: 'Active',       updated: '14m ago',   phone: '+977 98-4211-0041', joined: 'Mar 12, 2024', coop: 'Pokhara Growers',       plots: 2 },
  { id: 'KL-0440', name: 'Arjun Rai',      region: 'Jhapa',     store: 'Damak Collection', crop: 'Tea',       area: 5.2, status: 'Needs review', updated: '1h ago',    phone: '+977 98-4211-0040', joined: 'Feb 28, 2024', coop: 'East Plantations',      plots: 1 },
  { id: 'KL-0439', name: 'Maya Gurung',    region: 'Lamjung',   store: 'Besisahar Centre', crop: 'Millet',    area: 0.8, status: 'Active',       updated: '3h ago',    phone: '+977 98-4211-0039', joined: 'Feb 20, 2024', coop: '—',                     plots: 1 },
  { id: 'KL-0438', name: 'Dipak Shrestha', region: 'Bardiya',   store: 'Gulariya Store',   crop: 'Wheat',     area: 3.7, status: 'Overdue',      updated: 'Yesterday', phone: '+977 98-4211-0038', joined: 'Feb 18, 2024', coop: 'Bardiya Farmers Union', plots: 4 },
  { id: 'KL-0437', name: 'Kamala Thapa',   region: 'Rupandehi', store: 'Butwal Warehouse', crop: 'Lentil',    area: 1.9, status: 'Active',       updated: 'Yesterday', phone: '+977 98-4211-0037', joined: 'Feb 10, 2024', coop: 'Lumbini Pulses',        plots: 2 },
  { id: 'KL-0436', name: 'Nabin Lama',     region: 'Chitwan',   store: 'Bharatpur Hub',    crop: 'Rice',      area: 2.1, status: 'Active',       updated: '2d ago',    phone: '+977 98-4211-0036', joined: 'Feb 05, 2024', coop: 'Terai Fields Co-op',    plots: 2 },
  { id: 'KL-0435', name: 'Sarita Magar',   region: 'Kaski',     store: 'Pokhara Depot',    crop: 'Vegetable', area: 0.6, status: 'Draft',        updated: '3d ago',    phone: '+977 98-4211-0035', joined: 'Feb 02, 2024', coop: '—',                     plots: 1 },
];

export const PLOTS_BY_FARMER: Record<string, Plot[]> = {
  'KL-0442': [
    { code: 'KL-0442-A', crop: 'Rice',      area: 1.4, sowing: 'Jun 12', harvest: 'Oct 20', stage: 'Vegetative', health: 'Good' },
    { code: 'KL-0442-B', crop: 'Rice',      area: 0.6, sowing: 'Jun 18', harvest: 'Oct 28', stage: 'Vegetative', health: 'Good' },
    { code: 'KL-0442-C', crop: 'Vegetable', area: 0.4, sowing: 'May 02', harvest: 'Jul 30', stage: 'Harvesting', health: 'Excellent' },
  ],
  'KL-0441': [
    { code: 'KL-0441-A', crop: 'Maize',  area: 0.7, sowing: 'May 28', harvest: 'Sep 15', stage: 'Flowering',  health: 'Good' },
    { code: 'KL-0441-B', crop: 'Lentil', area: 0.4, sowing: 'Apr 10', harvest: 'Jul 05', stage: 'Harvesting', health: 'Fair' },
  ],
  'KL-0440': [{ code: 'KL-0440-A', crop: 'Tea',   area: 5.2, sowing: 'Perennial', harvest: 'Year-round', stage: 'Plucking',   health: 'Good' }],
  'KL-0439': [{ code: 'KL-0439-A', crop: 'Millet', area: 0.8, sowing: 'Jun 01',    harvest: 'Oct 12',     stage: 'Vegetative', health: 'Good' }],
  'KL-0438': [
    { code: 'KL-0438-A', crop: 'Wheat',     area: 2.0, sowing: 'Nov 2025', harvest: 'Apr 2026', stage: 'Harvested',  health: 'Good' },
    { code: 'KL-0438-B', crop: 'Wheat',     area: 0.8, sowing: 'Nov 2025', harvest: 'Apr 2026', stage: 'Harvested',  health: 'Fair' },
    { code: 'KL-0438-C', crop: 'Lentil',    area: 0.5, sowing: 'Apr 2026', harvest: 'Jul 2026', stage: 'Vegetative', health: 'Good' },
    { code: 'KL-0438-D', crop: 'Vegetable', area: 0.4, sowing: 'Mar 2026', harvest: 'Jun 2026', stage: 'Harvesting', health: 'Excellent' },
  ],
  'KL-0437': [
    { code: 'KL-0437-A', crop: 'Lentil',    area: 1.2, sowing: 'Apr 15', harvest: 'Jul 10', stage: 'Flowering',  health: 'Good' },
    { code: 'KL-0437-B', crop: 'Vegetable', area: 0.7, sowing: 'Mar 10', harvest: 'Jun 15', stage: 'Harvesting', health: 'Good' },
  ],
  'KL-0436': [
    { code: 'KL-0436-A', crop: 'Rice', area: 1.2, sowing: 'Jun 10', harvest: 'Oct 18', stage: 'Vegetative', health: 'Good' },
    { code: 'KL-0436-B', crop: 'Rice', area: 0.9, sowing: 'Jun 15', harvest: 'Oct 22', stage: 'Vegetative', health: 'Good' },
  ],
  'KL-0435': [{ code: 'KL-0435-A', crop: 'Vegetable', area: 0.6, sowing: '—', harvest: '—', stage: 'Draft', health: '—' }],
};

export const FEED: FeedGroup[] = [
  { day: 'Today', items: [
    { kind: 'note',  who: 'Riya Acharya',  tone: 'brand',   time: '1h ago',  body: 'Verified phone number and plot boundaries with farmer over call.' },
    { kind: 'event', who: 'Bishal Tamang', tone: 'info',    time: '3h ago',  text: 'uploaded soil test result', file: { name: 'soil-test-q2.pdf', type: 'PDF', size: '412 KB' } },
    { kind: 'event', who: 'System',        tone: 'neutral', time: '5h ago',  text: 'auto-synced weather advisory for Chitwan region' },
    { kind: 'event', who: 'Bishal Tamang', tone: 'brand',   time: '8h ago',  text: 'logged irrigation cycle', extra: 'Plot KL-0442-A · 2.4 ha · 42 mm' },
  ]},
  { day: 'Yesterday', items: [
    { kind: 'event', who: 'Riya Acharya',  tone: 'brand',   time: 'Apr 25, 16:40', text: 'approved registration', extra: 'Status changed from Needs review → Active' },
    { kind: 'photo', who: 'Bishal Tamang', tone: 'soil',    time: 'Apr 25, 11:02', text: 'uploaded 3 field photos' },
    { kind: 'event', who: 'System',        tone: 'warn',    time: 'Apr 25, 07:15', text: 'flagged low seed inventory at linked warehouse', extra: 'Chitwan warehouse · paddy seed below threshold' },
  ]},
  { day: 'Apr 24', items: [
    { kind: 'event', who: 'Bishal Tamang', tone: 'brand',   time: '14:22', text: 'completed harvest record', extra: '1.2 t rice harvested from plot KL-0442-A' },
    { kind: 'event', who: 'Riya Acharya',  tone: 'neutral', time: '09:10', text: 'updated contact phone number' },
  ]},
];
