import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, finalize } from 'rxjs/operators';
import {
  ALERT_STATUSES,
  Alert,
  AlertFilters,
  AlertStatus,
  Facility,
  SEVERITIES,
  Severity,
} from '../../../models';
import { AlertService } from '../../../core/services/alert/alert';
import { FacilityService } from '../../../core/services/facility/facility';
import { CreateAlert } from '../create-alert/create-alert';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CreateAlert],
  templateUrl: './alert-list.html',
  styleUrl: './alert-list.scss',
})
export class AlertList implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  facilities: Facility[] = [];

  loading = false;
  error = '';
  showCreateAlertModal = false;

  searchTerm = '';
  selectedFacilityId: number | null = null;
  selectedSeverity: Severity | null = null;
  selectedStatus: AlertStatus | null = null;
  fromDate = '';
  toDate = '';
  pageSize = 10;

  readonly severities = SEVERITIES;
  readonly statuses = ALERT_STATUSES;
  readonly pageSizes = [5, 10, 25, 50];

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly alertService: AlertService,
    private readonly facilityService: FacilityService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.facilityService.getFacilities().subscribe({
      next: (facilities) => (this.facilities = facilities),
      error: (err) => console.error('Failed to load facilities:', err),
    });

    // Debounced search: only fires server request 400ms after user stops typing
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(() => {
          this.loading = true;
          this.error = '';
          return this.alertService.getAlerts(this.buildFilters()).pipe(
            finalize(() => {
              this.loading = false;
              this.changeDetector.markForCheck();
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => (this.alerts = response.items),
        error: (err) => {
          console.error('Failed to load alerts:', err);
          this.error = 'Unable to load alerts. Please try again.';
        },
      });

    this.loadAlerts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildFilters(): AlertFilters {
    const filters: AlertFilters = {};
    if (this.searchTerm.trim())     filters.search     = this.searchTerm.trim();
    if (this.selectedFacilityId)    filters.facilityId = this.selectedFacilityId;
    if (this.selectedSeverity)      filters.severity   = this.selectedSeverity;
    if (this.selectedStatus)        filters.status     = this.selectedStatus;
    if (this.fromDate)              filters.fromDate   = this.fromDate;
    if (this.toDate)                filters.toDate     = this.toDate;
    return filters;
  }

  get displayedAlerts(): Alert[] {
    return this.alerts.slice(0, this.pageSize);
  }

  loadAlerts(): void {
    this.loading = true;
    this.error = '';
    this.alertService
      .getAlerts(this.buildFilters())
      .pipe(finalize(() => {
        this.loading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (response) => {
          this.alerts = response.items;
        },
        error: (err) => {
          console.error('Failed to load alerts:', err);
          this.error = 'Unable to load alerts. Please try again.';
        },
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.loadAlerts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFacilityId = null;
    this.selectedSeverity = null;
    this.selectedStatus = null;
    this.fromDate = '';
    this.toDate = '';
    this.loadAlerts();
  }

  onAlertCreated(alert: Alert): void {
    this.showCreateAlertModal = false;
    this.loadAlerts();
  }
}
