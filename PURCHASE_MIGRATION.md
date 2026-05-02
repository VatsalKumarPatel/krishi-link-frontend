# Purchase Module — UI Migration Guide

> Reference doc for upgrading remaining purchase components to the `kl-detail-grid` + drawer pattern established in the Supplier pages (mirroring the Tenant admin design).

---

## Pattern Overview

### Before (current state in most purchase components)
- Detail page: flat list of cards with a simple page-header
- Add/edit: standalone full-page route (`/purchase/X/new`, `/purchase/X/:id/edit`)
- Navigation: `Router.navigate()` or `routerLink` for create/edit

### After (target state — see Supplier as reference)
- Detail page: two-column `kl-detail-grid` layout (info card left, tabs right)
- Add/edit: `kl-drawer` side panel, opened via a signal on the detail/list page
- Standalone add/edit routes removed from `purchase.routes.ts`

---

## Shared UI Tokens

| Class | Purpose |
|---|---|
| `kl-detail-grid` | Two-column responsive grid — info card + content area |
| `kl-detail-header` | Avatar + name + meta row inside the info card |
| `kl-avatar-lg` | Large circular avatar (initials) |
| `kl-detail-name` | Primary entity name |
| `kl-detail-meta` | Secondary meta line (code, location, etc.) |
| `kl-stat-pill` | KPI pill: `kl-stat-pill-label` + `kl-stat-pill-val` |
| `kl-tabs` / `kl-tab` | Tab strip; add `is-active` class to selected tab |
| `kl-count` | Pill badge inside a tab button (count) |
| `kl-crumbs` + `.sep` | Breadcrumb row |
| `kl-dl` / `dt` / `dd` | Definition list for field/value pairs |
| `kl-drawer` (component) | Side-panel drawer: `[open]`, `[title]`, `[subtitle]`, `(close)` |
| `kl-form-section` | Section heading inside a drawer form |
| `kl-form-label` / `kl-form-hint` | Label and hint text |
| `animate-pulse bg-bg-muted rounded` | Skeleton shimmer block |

---

## Step-by-Step Conversion

### 1 — Create a `<entity>-add` drawer component

**Location:** `src/app/purchase/<section>/<entity>-add/`  
**Reference:** `src/app/purchase/suppliers/supplier-add/`

```typescript
// <entity>-add.component.ts
@Component({ selector: 'app-<entity>-add', standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './<entity>-add.component.html',
  styles: [':host { display: contents; }'] })
export class EntityAddComponent implements OnChanges {
  @Input() open = false;
  @Input() entityId: string | null = null;   // null → create, string → edit
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // Internals: loading signal, form object, saving flag, saveError string
  // ngOnChanges: when open+entityId set → load entity; when open+null → reset form
  // submit(): call service.create() or service.update(), toast on success/error
}
```

**HTML structure:**
```html
<kl-drawer [open]="open" [title]="title" [subtitle]="subtitle" (close)="close.emit()">
  @if (loading()) { <div …>Loading…</div> } @else {
    <div class="kl-form">
      <div class="kl-form-section">Section Name</div>
      <!-- fields -->
      @if (saveError) { <div class="full" …>{{ saveError }}</div> }
    </div>
  }
  <ng-container drawer-actions>
    <button class="kl-btn kl-btn-secondary" (click)="close.emit()">Cancel</button>
    <button class="kl-btn kl-btn-primary" (click)="submit()" [disabled]="saving || loading()">
      @if (saving) { Saving… } @else { {{ isEdit ? 'Save changes' : 'Create …' }} }
    </button>
  </ng-container>
</kl-drawer>
```

---

### 2 — Rewrite the detail component TS

**Reference:** `src/app/purchase/suppliers/supplier-detail/supplier-detail.component.ts`

Key changes:
- Replace individual `loadX()` calls with a single `forkJoin({...})` inside `loadAll(id)`
- Add `drawerOpen = signal(false)`
- Add `reloadAfterSave()` → closes drawer, calls `loadAll()`
- Add display helpers: `initials()`, `shortId()`, `statusVariant()`, `statusLabel()`, `formatDate()`
- Change `activeTab` type from `'overview' | ...` to `'details' | ...`
- Import the new `<entity>-add` component; add to `imports[]`
- Remove `Router` injection if no longer navigating from the detail page

```typescript
loadAll(id: string): void {
  this.loading.set(true);
  this.error.set(null);
  forkJoin({ entity: ..., relatedA: ..., relatedB: ... })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ({ entity, relatedA, relatedB }) => { /* set signals */ this.loading.set(false); },
      error: () => { this.error.set('Failed to load …'); this.loading.set(false); },
    });
}
```

---

### 3 — Rewrite the detail component HTML

**Reference:** `src/app/purchase/suppliers/supplier-detail/supplier-detail.component.html`

Structure:
```
Loading skeleton  →  @if (loading())
Error state       →  @if (!loading() && error())
Loaded state      →  @if (!loading() && !error() && entity(); as e)
  ├─ kl-page-header  (back button + kl-crumbs + action buttons)
  ├─ kl-detail-grid
  │   ├─ Left:  kl-card > kl-detail-header + kl-dl
  │   └─ Right: kl-stat-pill row + kl-tabs + tab panels (kl-card each)
  └─ <app-entity-add [open]="drawerOpen()" [entityId]="entityId()" (close)="…" (saved)="…" />
```

Loading skeleton example:
```html
<div class="kl-detail-grid">
  <div class="kl-card" style="padding:24px;">
    <div class="animate-pulse bg-bg-muted rounded-full" style="width:56px;height:56px;margin-bottom:16px;"></div>
    @for (i of [1,2,3,4,5]; track i) {
      <div class="animate-pulse bg-bg-muted rounded h-4 w-full mb-3"></div>
    }
  </div>
  <div>
    <div style="display:flex; gap:10px; margin-bottom:12px;">
      @for (i of [1,2,3]; track i) {
        <div class="animate-pulse bg-bg-muted rounded-md" style="width:90px;height:56px;"></div>
      }
    </div>
    <div class="kl-card" style="padding:24px;">
      @for (i of [1,2,3]; track i) {
        <div class="animate-pulse bg-bg-muted rounded h-4 w-full mb-3"></div>
      }
    </div>
  </div>
</div>
```

---

### 4 — Update the list component

**Reference:** `src/app/purchase/suppliers/supplier-list/supplier-list.component.ts`

Add to class:
```typescript
drawerOpen = signal(false);
editEntityId = signal<string | null>(null);

openAdd(): void { this.editEntityId.set(null); this.drawerOpen.set(true); }
openEdit(row: EntityRow): void { this.editEntityId.set(row.id); this.drawerOpen.set(true); }
onDrawerSaved(): void { this.drawerOpen.set(false); this.resource.reload(); }
```

Add to HTML (after the grid card):
```html
<app-entity-add
  [open]="drawerOpen()"
  [entityId]="editEntityId()"
  (close)="drawerOpen.set(false)"
  (saved)="onDrawerSaved()" />
```

---

### 5 — Remove standalone routes

In `src/app/purchase/purchase.routes.ts`, delete the `/new` and `/:id/edit` route entries for the converted section. Keep the `/:id` (detail) and any sub-routes like `/:id/ledger`.

---

## Components Remaining to Convert

| Section | List | Detail | Add/Edit drawer |
|---|---|---|---|
| Purchases | `purchase-list` | `purchase-detail` | `purchase-add` (wrap `purchase-form`) |
| Purchase Returns | `return-list` | `return-detail` | `return-add` (wrap `return-form`) |
| Supplier Payments | `payment-list` | `payment-detail` | `payment-add` (wrap `payment-form`) |
| Batches | `batch-list` | `batch-detail` | n/a (read-only derived from purchases) |

> **Note:** `purchase-form` and `return-form` are complex multi-line-item forms. For these, evaluate whether a drawer is ergonomic (wide drawer or keep as full-page). The drawer approach works best for simple entity forms (≤ 10 fields). For purchase order entry, a dedicated full-page may remain appropriate — but the detail page should still adopt the `kl-detail-grid` layout and inline Edit button.

---

## Checklist for Each Component

- [ ] `<entity>-add` drawer component created (TS + HTML)
- [ ] Detail TS: `forkJoin` load, `drawerOpen` signal, `reloadAfterSave`, display helpers
- [ ] Detail HTML: `kl-detail-grid`, loading skeleton, error state, drawer at bottom
- [ ] List TS: `drawerOpen` + `editEntityId` signals, `openAdd`, `openEdit`, `onDrawerSaved`
- [ ] List HTML: `<app-entity-add>` added
- [ ] Routes: `/new` and `/:id/edit` entries removed from `purchase.routes.ts`
- [ ] Old `<entity>-form` standalone page deleted (if no other consumers)
