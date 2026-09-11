import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card',
  styleUrl: './card.scss',
  templateUrl: './card.html',
})
export class Card {

  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly clickable = input(false);

  readonly cardClick = output<void>();

  onClick(): void {
    if (this.clickable()) {
      this.cardClick.emit();
    }
  }

}
