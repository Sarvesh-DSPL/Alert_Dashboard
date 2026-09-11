import { Component, input } from '@angular/core';
import { Severity } from '../../../models';

@Component({
  selector: 'app-severity-badge',
  standalone: true,
  templateUrl: './severity-badge.html',
  styleUrl: './severity-badge.scss',
})
export class SeverityBadge {
  readonly severity = input.required<Severity>();
}