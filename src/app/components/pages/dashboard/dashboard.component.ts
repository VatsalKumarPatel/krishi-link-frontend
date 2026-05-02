import { Component } from '@angular/core';
import { KlCardComponent } from '../../shared/kl-card/kl-card.component';
import { StatCardComponent } from '../../shared/stat-card/stat-card.component';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { KlTodoComponent } from '../../shared/kl-todo/kl-todo.component';

export interface ActivityItem {
  who: string; what: string; plot: string; ago: string;
  tone: 'brand' | 'warn' | 'info' | 'soil';
}

@Component({
  selector: 'app-dashboard',
  imports: [KlCardComponent, StatCardComponent, BadgeComponent, KlTodoComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly sparkPoints = [180, 210, 250, 220, 280, 320, 360, 340, 410, 460, 520, 610];

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
