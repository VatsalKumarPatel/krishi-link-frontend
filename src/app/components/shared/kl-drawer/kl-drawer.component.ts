import { Component, Input, Output, EventEmitter, HostListener, OnInit, signal } from '@angular/core';

const DEFAULT_DRAWER_WIDTH = 480;
const DEFAULT_MIN_WIDTH = 360;
const DEFAULT_MAX_WIDTH = 960;
const DRAWER_WIDTH_KEY = 'kl-drawer-width';

@Component({
  selector: 'kl-drawer',
  standalone: true,
  templateUrl: './kl-drawer.component.html',
  styles: [':host { display: contents; }'],
})
export class KlDrawerComponent implements OnInit {
  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() resizable = true;
  @Input() width = DEFAULT_DRAWER_WIDTH;
  @Input() minWidth = DEFAULT_MIN_WIDTH;
  @Input() maxWidth = DEFAULT_MAX_WIDTH;
  @Input() persistWidth = true;
  @Output() close = new EventEmitter<void>();

  drawerWidth = signal(DEFAULT_DRAWER_WIDTH);
  resizing = signal(false);

  private startX = 0;
  private startWidth = DEFAULT_DRAWER_WIDTH;

  ngOnInit(): void {
    const stored = this.readStoredWidth();
    this.drawerWidth.set(this.clampWidth(stored ?? this.width));
  }

  startResize(event: PointerEvent): void {
    if (!this.resizable) return;

    event.preventDefault();
    event.stopPropagation();
    this.startX = event.clientX;
    this.startWidth = this.drawerWidth();
    this.resizing.set(true);
    document.body.classList.add('kl-drawer-resizing');
  }

  stopResize(): void {
    if (!this.resizing()) return;

    this.resizing.set(false);
    document.body.classList.remove('kl-drawer-resizing');
    this.storeWidth(this.drawerWidth());
  }

  resizeBy(delta: number): void {
    if (!this.resizable) return;

    const nextWidth = this.clampWidth(this.drawerWidth() + delta);
    this.drawerWidth.set(nextWidth);
    this.storeWidth(nextWidth);
  }

  resetWidth(): void {
    const nextWidth = this.clampWidth(this.width);
    this.drawerWidth.set(nextWidth);
    this.storeWidth(nextWidth);
  }

  onHandleKeydown(event: KeyboardEvent): void {
    if (!this.resizable) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.resizeBy(32);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.resizeBy(-32);
    } else if (event.key === 'Home') {
      event.preventDefault();
      const nextWidth = this.clampWidth(this.minWidth);
      this.drawerWidth.set(nextWidth);
      this.storeWidth(nextWidth);
    } else if (event.key === 'End') {
      event.preventDefault();
      const nextWidth = this.clampWidth(this.maxWidth);
      this.drawerWidth.set(nextWidth);
      this.storeWidth(nextWidth);
    }
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.resizing()) return;

    const delta = this.startX - event.clientX;
    this.drawerWidth.set(this.clampWidth(this.startWidth + delta));
  }

  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  onPointerEnd(): void {
    this.stopResize();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.drawerWidth.set(this.clampWidth(this.drawerWidth()));
  }

  private clampWidth(width: number): number {
    const viewportMax = Math.max(this.minWidth, window.innerWidth - 24);
    return Math.min(Math.max(width, this.minWidth), Math.min(this.maxWidth, viewportMax));
  }

  private readStoredWidth(): number | null {
    if (!this.persistWidth) return null;

    const stored = localStorage.getItem(DRAWER_WIDTH_KEY);
    const width = stored ? Number(stored) : NaN;
    return Number.isFinite(width) ? width : null;
  }

  private storeWidth(width: number): void {
    if (!this.persistWidth) return;

    localStorage.setItem(DRAWER_WIDTH_KEY, String(width));
  }
}
