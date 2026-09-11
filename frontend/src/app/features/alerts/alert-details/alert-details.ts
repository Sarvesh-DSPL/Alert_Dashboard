import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../../core/services/alert/alert';
import { ALERT_STATUSES, Alert, AlertStatus } from '../../../models';

@Component({
  selector: 'app-alert-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './alert-details.html',
  styleUrl: './alert-details.scss',
})
export class AlertDetails implements OnInit {

  alert: Alert | null = null;

  loading = true;
  updating = false;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly alertService: AlertService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid alert ID.';
      this.loading = false;
      return;
    }

    this.loadAlert(id);
  }

  loadAlert(id: number): void {
    this.loading = true;
    this.error = '';

    this.alertService
      .getAlert(id)
      .pipe(finalize(() => {
        this.loading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (alert) => {
          this.alert = alert;
        },
        error: (error) => {
          console.error('Failed to load alert:', error);

          this.alert = null;

          if (error.status === 404) {
            this.error = 'Alert not found.';
          } else {
            this.error = 'Unable to load alert. Please try again.';
          }
        },
      });
  }

  updateStatus(status: AlertStatus): void {
    if (!this.alert || this.updating || this.alert.status === status) {
      return;
    }

    this.updating = true;
    this.error = '';

    this.alertService
      .updateAlert(this.alert.id, { status })
      .pipe(finalize(() => {
        this.updating = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (updatedAlert) => {
          this.alert = updatedAlert;
          this.alertService.notifyStatusUpdated(updatedAlert);
        },
        error: (error) => {
          console.error('Failed to update alert:', error);
          this.error = 'Unable to update alert status. Please try again.';
        },
      });
  }

  resolveAlert(): void {
    this.updateStatus(ALERT_STATUSES[2]);
  }

  acknowledgeAlert(): void {
    this.updateStatus(ALERT_STATUSES[1]);
  }
}