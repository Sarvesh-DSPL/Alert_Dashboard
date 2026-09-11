import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Facility } from '../../../../models';
import { Alert } from '../../../../models';
import { FacilityService } from '../../../../core/services/facility/facility';
import { AlertService } from '../../../../core/services/alert/alert';

@Component({
  selector: 'app-facility-details',
  standalone: true,
  templateUrl: './facility-details.html',
  styleUrl: './facility-details.scss',
  imports : [DatePipe]
})
export class FacilityDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facilityService = inject(FacilityService);
  private readonly alertService = inject(AlertService);

  readonly facility = signal<Facility | null>(null);
  readonly alerts = signal<Alert[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const facilityId = Number(this.route.snapshot.paramMap.get('id'));

    if (!facilityId) {
      this.error.set('Invalid facility.');
      this.loading.set(false);
      return;
    }

    this.loadFacility(facilityId);
    this.loadAlerts(facilityId);
  }

  loadFacility(id: number): void {
    this.facilityService.getFacility(id).subscribe({
      next: (facility) => {
        this.facility.set(facility);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load facility', err);
        this.error.set('Unable to load facility details.');
        this.loading.set(false);
      },
    });
  }

  loadAlerts(facilityId: number): void {
    this.alertService.getAlerts({
      facilityId,
    }).subscribe({
      next: (response) => {
        this.alerts.set(response.items);
      },
      error: (err) => {
        console.error('Failed to load facility alerts', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/facilities']);
  }

  viewAlert(alertId: number): void {
    this.router.navigate(['/alerts', alertId]);
  }
}