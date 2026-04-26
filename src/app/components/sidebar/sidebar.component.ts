import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly nav: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/products',  label: 'Products',  icon: 'package' },
    { path: '/inventory', label: 'Inventory', icon: 'layers' },
    { path: '/transfers', label: 'Transfers', icon: 'arrow-right-left' },
  ];

  readonly adminNav: NavItem[] = [
    { path: '/admin/tenants', label: 'Tenants', icon: 'building-2' },
    { path: '/admin/stores',  label: 'Stores',  icon: 'store' },
  ];
}
