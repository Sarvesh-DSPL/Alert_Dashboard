import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  readonly message = input('Loading…');
}