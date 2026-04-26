import { Component } from '@angular/core';
import { KlCardComponent } from '../../shared/kl-card/kl-card.component';
import { StatCardComponent } from '../../shared/stat-card/stat-card.component';
import { BadgeComponent } from '../../shared/badge/badge.component';

export interface FarmerRow {
  id: string; name: string; region: string; crop: string; area: string;
  status: 'Active' | 'Needs review' | 'Overdue' | 'Draft'; updated: string;
}

export interface ActivityItem {
  who: string; what: string; plot: string; ago: string;
  tone: 'brand' | 'warn' | 'info' | 'soil';
}

@Component({
  selector: 'app-dashboard',
  imports: [KlCardComponent, StatCardComponent, BadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly sparkPoints = [180, 210, 250, 220, 280, 320, 360, 340, 410, 460, 520, 610];

  readonly farmers: FarmerRow[] = [
    { id: 'KL-0442', name: 'Bishal Tamang',  region: 'Chitwan',   crop: 'Rice',   area: '2.4 ha', status: 'Active',       updated: '2m ago' },
    { id: 'KL-0441', name: 'Sunita Poudel',  region: 'Kaski',     crop: 'Maize',  area: '1.1 ha', status: 'Active',       updated: '14m ago' },
    { id: 'KL-0440', name: 'Arjun Rai',      region: 'Jhapa',     crop: 'Tea',    area: '5.2 ha', status: 'Needs review', updated: '1h ago' },
    { id: 'KL-0439', name: 'Maya Gurung',    region: 'Lamjung',   crop: 'Millet', area: '0.8 ha', status: 'Active',       updated: '3h ago' },
    { id: 'KL-0438', name: 'Dipak Shrestha', region: 'Bardiya',   crop: 'Wheat',  area: '3.7 ha', status: 'Overdue',      updated: 'Yesterday' },
    { id: 'KL-0437', name: 'Kamala Thapa',   region: 'Rupandehi', crop: 'Lentil', area: '1.9 ha', status: 'Active',       updated: 'Yesterday' },
  ];

  readonly activity: ActivityItem[] = [
    { who: 'Sunita Poudel', what: 'logged irrigation cycle',    plot: 'KL-0441 · Kaski',   ago: '12m',  tone: 'brand' },
    { who: 'System',        what: 'flagged low seed inventory', plot: 'Bardiya warehouse',  ago: '38m',  tone: 'warn'  },
    { who: 'Arjun Rai',     what: 'uploaded soil test results', plot: 'KL-0440 · Jhapa',   ago: '1h',   tone: 'info'  },
    { who: 'Maya Gurung',   what: 'completed harvest record',   plot: 'KL-0439 · Lamjung', ago: '3h',   tone: 'soil'  },
    { who: 'Riya Acharya',  what: 'approved 14 registrations',  plot: 'Regional queue',    ago: '5h',   tone: 'brand' },
  ];

  readonly toneDot: Record<string, string> = {
    brand: '#3C9A4A', warn: '#C98A1A', info: '#2D6EA8', soil: '#8A5A2B',
  };

  readonly weather = [
    { day: 'Mon', temp: 31, rain: 10 },
    { day: 'Tue', temp: 30, rain: 45 },
    { day: 'Wed', temp: 28, rain: 80 },
    { day: 'Thu', temp: 27, rain: 65 },
    { day: 'Fri', temp: 29, rain: 20 },
  ];

  readonly statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
    'Active':       'success',
    'Needs review': 'warning',
    'Overdue':      'danger',
    'Draft':        'neutral',
  };

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('');
  }

  get sparkPath(): string {
    const w = 600, h = 80;
    const pts = this.sparkPoints;
    const max = Math.max(...pts), min = Math.min(...pts);
    const sx = (i: number) => (i / (pts.length - 1)) * w;
    const sy = (v: number) => h - ((v - min) / (max - min || 1)) * h;
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(p)}`).join(' ');
  }

  get sparkFill(): string {
    return `${this.sparkPath} L 600 80 L 0 80 Z`;
  }
}
