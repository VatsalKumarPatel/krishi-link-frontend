import { Component, signal, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UserService } from '@services/user.service';
import { StorePickerService, MyStoreDto } from '@services/store-picker.service';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnInit, OnDestroy {
  readonly userService = inject(UserService);
  readonly storePicker = inject(StorePickerService);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  storeMenuOpen = signal(false);
  notifOpen = signal(false);
  profileOpen = signal(false);
  pageTitle = signal('');
  pageSubtitle = signal('');

  private sub = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.updateTitleFromRoute();
    this.sub.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.updateTitleFromRoute())
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private updateTitleFromRoute() {
    let active = this.route;
    while (active.firstChild) active = active.firstChild;
    const data = active.snapshot.data;
    this.pageTitle.set(data['title'] ?? '');
    this.pageSubtitle.set(data['subtitle'] ?? '');
  }

  toggleStore(e: Event): void {
    e.stopPropagation();
    this.storeMenuOpen.update(v => !v);
    this.notifOpen.set(false);
    this.profileOpen.set(false);
  }

  selectStore(store: MyStoreDto | null): void {
    this.storePicker.select(store);
    this.storeMenuOpen.set(false);
  }

  toggleNotif(e: Event) {
    e.stopPropagation();
    this.notifOpen.update(v => !v);
    this.profileOpen.set(false);
    this.storeMenuOpen.set(false);
  }

  toggleProfile(e: Event) {
    e.stopPropagation();
    this.profileOpen.update(v => !v);
    this.notifOpen.set(false);
    this.storeMenuOpen.set(false);
  }

  signOut(): void {
    this.authService.logout().subscribe({
      complete: () => this.doLocalLogout(),
      error: () => this.doLocalLogout(),
    });
  }

  private doLocalLogout(): void {
    this.tokenService.clearTokens();
    this.userService.clear();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click')
  closeAll() {
    this.storeMenuOpen.set(false);
    this.notifOpen.set(false);
    this.profileOpen.set(false);
  }
}
