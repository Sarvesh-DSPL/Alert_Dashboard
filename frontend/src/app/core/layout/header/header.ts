import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly menuToggle = output<void>();
  profileMenuOpen = false;

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
}