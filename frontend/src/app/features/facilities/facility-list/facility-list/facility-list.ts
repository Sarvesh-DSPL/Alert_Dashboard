import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Facility } from '../../../../models';
import { FacilityService } from '../../../../core/services/facility/facility';

@Component({
  selector: 'app-facility-list',
  standalone: true,
  templateUrl: './facility-list.html',
  styleUrl: './facility-list.scss',
})
export class FacilityList implements OnInit {
  private readonly facilityService = inject(FacilityService);
  private readonly router = inject(Router);

  readonly facilities = signal<Facility[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.loading.set(true);
    this.error.set('');

    this.facilityService.getFacilities().subscribe({
      next: (facilities) => {
        this.facilities.set(facilities);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load facilities', err);
        this.error.set('Unable to load facilities. Please try again.');
        this.loading.set(false);
      },
    });
  }

  viewFacility(facilityId: number): void {
    this.router.navigate(['/facilities', facilityId]);
  }
}