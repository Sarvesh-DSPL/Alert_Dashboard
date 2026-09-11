import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly open = input(false);
  readonly navigationSelected = output<void>();

  readonly navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: '▦',
    },
    {
      label: 'Alerts',
      route: '/alerts',
      icon: '⚠',
    },
    {
      label: 'Facilities',
      route: '/facilities',
      icon: '⌂',
    },
  ];

  onNavigationSelected(): void {
    this.navigationSelected.emit();
  }
}