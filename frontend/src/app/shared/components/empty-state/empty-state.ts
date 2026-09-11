import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly title = input('No results found');

  readonly message = input(
    'There is nothing to display yet.'
  );

  readonly actionLabel = input<string>();

  readonly action = output<void>();
}