import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  readonly title = input('Something went wrong');

  readonly message = input(
    'We could not load this information. Please try again.'
  );

  readonly retryLabel = input('Try again');

  readonly retry = output<void>();
}