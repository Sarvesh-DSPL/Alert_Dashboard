import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../../core/services/alert/alert';
import { FacilityService } from '../../../core/services/facility/facility';
import { Alert, DEFAULT_ALERT_TYPES, Facility, SEVERITIES, Severity } from '../../../models';

@Component({
  selector: 'app-create-alert',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-alert.html',
  styleUrl: './create-alert.scss',
})
export class CreateAlert implements OnInit {
  private readonly fb             = inject(FormBuilder);
  private readonly alertService   = inject(AlertService);
  private readonly facilityService = inject(FacilityService);

  @Output() cancelled = new EventEmitter<void>();
  @Output() created   = new EventEmitter<Alert>();

  readonly severities = SEVERITIES;

  readonly defaultAlertTypes = DEFAULT_ALERT_TYPES;

  facilities: Facility[] = [];
  alertTypes: string[] = [...this.defaultAlertTypes];
  areas: string[] = [];

  facilitiesLoading = false;
  optionsLoading    = false;
  submitting        = false;
  loadError         = '';
  submitError       = '';
  submitted         = false;

  readonly alertForm = this.fb.nonNullable.group({
    type:        ['', Validators.required],
    facilityId:  [0,  [Validators.required, Validators.min(1)]],
    area:        ['', Validators.required],
    severity:    [SEVERITIES[1] as Severity, Validators.required],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    this.loadFacilities();
    this.loadAlertTypes();
  }

  private loadFacilities(): void {
    this.facilitiesLoading = true;
    this.facilityService.getFacilities().subscribe({
      next: (facilities) => {
        this.facilities = facilities;
        this.facilitiesLoading = false;
      },
      error: (err) => {
        console.error('Failed to load facilities:', err);
        this.loadError = 'Unable to load facilities. Please try again.';
        this.facilitiesLoading = false;
      },
    });
  }

  private loadAlertTypes(): void {
    this.optionsLoading = true;
    this.alertService
      .getAlertOptions()
      .pipe(finalize(() => (this.optionsLoading = false)))
      .subscribe({
        next: (options) => {
          // Merge DB types with our default list, keep unique
          const merged = Array.from(new Set([...this.defaultAlertTypes, ...options.types])).sort();
          this.alertTypes = merged;
        },
        error: (err) => {
          console.error('Failed to load alert types:', err);
        },
      });
  }

  onFacilityChange(): void {
    const facilityId = Number(this.alertForm.controls.facilityId.value);
    this.alertForm.controls.area.reset('');
    this.areas = [];

    if (!facilityId) return;

    // Use areas stored on the facility object first (from the list response)
    const cached = this.facilities.find((f) => f.id === facilityId);
    if (cached?.areas && cached.areas.length > 0) {
      this.areas = [...cached.areas].sort();
      return;
    }

    // Fallback: fetch areas from dedicated endpoint
    this.facilityService.getFacilityAreas(facilityId).subscribe({
      next: (response) => (this.areas = response.areas),
      error: (err) => console.error('Failed to load areas:', err),
    });
  }

  isInvalid(field: 'type' | 'facilityId' | 'area' | 'severity' | 'description'): boolean {
    const ctrl = this.alertForm.controls[field];
    return ctrl.invalid && (ctrl.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted    = true;
    this.submitError  = '';

    if (this.alertForm.invalid) {
      this.alertForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const raw = this.alertForm.getRawValue();

    this.alertService
      .createAlert({
        type:        raw.type.trim(),
        facilityId:  raw.facilityId,
        area:        raw.area.trim(),
        severity:    raw.severity,
        description: raw.description.trim(),
      })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (alert) => {
          this.created.emit(alert);
          this.resetForm();
        },
        error: (err) => {
          console.error('Failed to create alert:', err);
          const detail = err?.error?.detail;
          if (detail === 'Area is not available for the selected facility.') {
            this.submitError = 'The selected area is not valid for this facility.';
          } else if (typeof detail === 'string') {
            this.submitError = detail;
          } else {
            this.submitError = 'Unable to create the alert. Please try again.';
          }
        },
      });
  }

  private resetForm(): void {
    this.alertForm.reset({ type: '', facilityId: 0, area: '', severity: SEVERITIES[1], description: '' });
    this.areas = [];
    this.submitted = false;
    this.submitError = '';
  }

  onCancel(): void {
    if (!this.submitting) this.cancelled.emit();
  }
}
