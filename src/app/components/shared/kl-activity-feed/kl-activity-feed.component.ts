import { Component, Input } from '@angular/core';

export interface FeedItem {
  kind: 'note' | 'event' | 'photo' | 'file';
  who: string;
  tone: string;
  time: string;
  text?: string;
  body?: string;
  extra?: string;
  file?: { name: string; type: string; size: string };
}

export interface FeedGroup {
  day: string;
  items: FeedItem[];
}

@Component({
  selector: 'kl-activity-feed',
  standalone: true,
  templateUrl: './kl-activity-feed.component.html',
  styles: [':host { display: contents; }'],
})
export class KlActivityFeedComponent {
  @Input() feed: FeedGroup[] = [];
  @Input() placeholder = 'Add an internal note…';

  feedIcoClass(tone: string) { return 't-' + tone; }
}
