import { BadgeVariant } from '@shared/badge/badge.component';
import { FeedGroup, FeedItem } from '@shared/kl-activity-feed/kl-activity-feed.component';
import { ActivityLogDto } from '@app/models/tenant.model';

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export function statusVariant(isActive: boolean): BadgeVariant {
  return isActive ? 'success' : 'neutral';
}

export function statusLabel(isActive: boolean): string {
  return isActive ? 'Active' : 'Inactive';
}

export function formatLocation(city?: string | null, state?: string | null): string {
  const parts = [city, state].filter((v): v is string => !!v);
  return parts.length ? parts.join(', ') : '—';
}

export function formatAddress(s: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}): string {
  return [s.addressLine1, s.addressLine2, s.city, s.state, s.pincode]
    .filter((v): v is string => !!v)
    .join(', ');
}

export function toFeedGroups(logs: ActivityLogDto[]): FeedGroup[] {
  if (!logs.length) return [];
  const groups = new Map<string, FeedItem[]>();
  for (const log of logs) {
    const day = feedDayLabel(log.createdAt);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(logToFeedItem(log));
  }
  return Array.from(groups.entries()).map(([day, items]) => ({ day, items }));
}

function logToFeedItem(log: ActivityLogDto): FeedItem {
  return {
    kind: 'event',
    who: log.actorName ?? 'System',
    tone: feedToneFor(log.eventType),
    time: feedFormatDate(log.createdAt),
    text: log.description ?? log.eventType ?? '',
    extra: log.referenceNumber ?? undefined,
  };
}

function feedToneFor(eventType: string | null): string {
  if (!eventType) return 'neutral';
  const t = eventType.toLowerCase();
  if (t.includes('creat') || t.includes('activ')) return 'success';
  if (t.includes('delet') || t.includes('deactiv')) return 'danger';
  if (t.includes('updat') || t.includes('edit')) return 'info';
  return 'neutral';
}

function feedFormatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function feedDayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
