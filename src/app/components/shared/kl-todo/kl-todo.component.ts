import {
  Component, computed, ElementRef, HostListener, inject, OnDestroy, OnInit, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@services/toast.service';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'med' | 'low';
  date: string;
}

const TODO_KEY = 'klDashboardTodos';

function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function shiftDate(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function toISO(d: Date): string {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
}

function formatDateLabel(iso: string): string {
  const today = todayISO();
  if (iso === today) return 'Today';
  if (iso === shiftDate(today, 1)) return 'Tomorrow';
  if (iso === shiftDate(today, -1)) return 'Yesterday';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

const SEED: Todo[] = [
  { id: 1, text: 'Review 14 pending farmer registrations', done: false, priority: 'high', date: todayISO() },
  { id: 2, text: 'Approve seed dispatch to Bharatpur Hub',  done: false, priority: 'med',  date: todayISO() },
  { id: 3, text: 'Call Arjun Rai re: soil test result',     done: true,  priority: 'med',  date: todayISO() },
  { id: 4, text: 'Verify Q2 inventory reconciliation',      done: false, priority: 'low',  date: todayISO() },
];

@Component({
  selector: 'kl-todo-card',
  imports: [FormsModule],
  templateUrl: './kl-todo.component.html',
})
export class KlTodoComponent implements OnInit, OnDestroy {
  private readonly toast = inject(ToastService);
  private readonly el = inject(ElementRef);

  // Ephemeral form state (no need for signals — not consumed reactively by other signals)
  draft = '';
  priority: 'high' | 'med' | 'low' = 'med';

  // Reactive state
  readonly todos = signal<Todo[]>(this.loadTodos());
  readonly selectedDate = signal(todayISO());
  readonly calOpen = signal(false);
  readonly calViewYear = signal(new Date().getFullYear());
  readonly calViewMonth = signal(new Date().getMonth());

  // Derived
  readonly today = todayISO();

  readonly visible = computed(() =>
    this.todos()
      .filter(t => t.date === this.selectedDate())
      .sort((a, b) => (a.done !== b.done ? (a.done ? 1 : -1) : 0))
  );

  readonly done  = computed(() => this.visible().filter(t => t.done).length);
  readonly total = computed(() => this.visible().length);
  readonly pct   = computed(() => this.total() ? Math.round((this.done() / this.total()) * 100) : 0);
  readonly isToday   = computed(() => this.selectedDate() === this.today);
  readonly dateLabel = computed(() => formatDateLabel(this.selectedDate()));
  readonly fullDate  = computed(() =>
    new Date(this.selectedDate() + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
  );
  readonly taskDates = computed(() => new Set(this.todos().map(t => t.date)));

  readonly calMonthLabel = computed(() =>
    new Date(this.calViewYear(), this.calViewMonth(), 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );

  readonly calCells = computed(() => {
    const y = this.calViewYear(), m = this.calViewMonth();
    const startWeekday = new Date(y, m, 1).getDay();
    const daysInMonth  = new Date(y, m + 1, 0).getDate();
    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null, iso: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: toISO(new Date(y, m, d)) });
    while (cells.length % 7 !== 0) cells.push({ day: null, iso: null });
    return cells;
  });

  readonly calDows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  readonly priorityColors: Record<string, string> = {
    high: '#B7362E',
    med:  '#C98A1A',
    low:  '#3C9A4A',
  };

  ngOnInit(): void {
    document.addEventListener('mousedown', this.onDocClick);
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousedown', this.onDocClick);
  }

  private readonly onDocClick = (event: MouseEvent): void => {
    if (!this.calOpen()) return;
    const wrap = (this.el.nativeElement as HTMLElement).querySelector('.kl-todo-datepick-wrap');
    if (wrap && !wrap.contains(event.target as Node)) {
      this.calOpen.set(false);
    }
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  addTask(): void {
    const text = this.draft.trim();
    if (!text) {
      this.toast.warning('Please enter a task before adding.');
      return;
    }
    this.todos.update(ts => [...ts, { id: Date.now(), text, done: false, priority: this.priority, date: this.selectedDate() }]);
    this.draft = '';
    this.saveTodos();
    this.toast.success(`Added to ${this.dateLabel()}.`, 'Task added');
  }

  toggleTask(id: number): void {
    let completedText = '';
    this.todos.update(ts => ts.map(t => {
      if (t.id !== id) return t;
      const next = { ...t, done: !t.done };
      if (next.done) completedText = t.text;
      return next;
    }));
    this.saveTodos();
    if (completedText) this.toast.success(`Completed: ${completedText}`, 'Nice work');
  }

  removeTask(id: number): void {
    const target = this.todos().find(t => t.id === id);
    this.todos.update(ts => ts.filter(t => t.id !== id));
    this.saveTodos();
    if (target) this.toast.info(`Removed "${target.text}".`, 'Task removed');
  }

  prevDay(): void { this.selectedDate.update(d => shiftDate(d, -1)); }
  nextDay(): void { this.selectedDate.update(d => shiftDate(d, 1)); }
  jumpToToday(): void { this.selectedDate.set(this.today); }

  toggleCal(): void {
    this.calOpen.update(o => !o);
    if (this.calOpen()) {
      const d = new Date(this.selectedDate() + 'T00:00:00');
      this.calViewYear.set(d.getFullYear());
      this.calViewMonth.set(d.getMonth());
    }
  }

  selectDate(iso: string): void {
    this.selectedDate.set(iso);
    this.calOpen.set(false);
  }

  jumpToTodayFromCal(): void {
    this.selectedDate.set(this.today);
    this.calOpen.set(false);
  }

  calPrevMonth(): void {
    if (this.calViewMonth() === 0) { this.calViewYear.update(y => y - 1); this.calViewMonth.set(11); }
    else { this.calViewMonth.update(m => m - 1); }
  }

  calNextMonth(): void {
    if (this.calViewMonth() === 11) { this.calViewYear.update(y => y + 1); this.calViewMonth.set(0); }
    else { this.calViewMonth.update(m => m + 1); }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private loadTodos(): Todo[] {
    try {
      const saved = JSON.parse(localStorage.getItem(TODO_KEY) ?? 'null') as Todo[] | null;
      if (Array.isArray(saved) && saved.length > 0) {
        return saved.map(t => ({ ...t, date: t.date || todayISO() }));
      }
    } catch { /* fall through */ }
    return SEED.map(t => ({ ...t }));
  }

  private saveTodos(): void {
    localStorage.setItem(TODO_KEY, JSON.stringify(this.todos()));
  }
}
