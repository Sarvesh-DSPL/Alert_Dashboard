import { Component, input } from '@angular/core';
import { AlertStatus } from '../../../models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  readonly status = input.required<AlertStatus>();
}