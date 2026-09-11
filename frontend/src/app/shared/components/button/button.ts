import { Component, input, output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly variant = input<ButtonVariant>('primary');

  readonly disabled = input(false);

  readonly loading = input(false);

  readonly label = input('');

  readonly ariaLabel = input<string>();

  readonly clicked = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}