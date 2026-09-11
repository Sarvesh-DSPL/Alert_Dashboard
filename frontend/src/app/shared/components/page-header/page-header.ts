import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly title = input.required<string>();

  readonly subtitle = input<string>();

  readonly actionLabel = input<string>();

  readonly action = output<void>();
}