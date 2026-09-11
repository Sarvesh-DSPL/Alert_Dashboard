import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { AlertService } from '../../core/services/alert/alert';
import { DashboardService } from '../../core/services/dashboard/dashboard';
import { DashboardStats } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {

  stats: DashboardStats | null = null;

  loading = true;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly alertService: AlertService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.alertService.statusUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadDashboard());
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = '';

    this.dashboardService
      .getStats()
      .pipe(finalize(() => {
        this.loading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (data) => {
          this.stats = data;
        },
        error: (err) => {
          console.error('DASHBOARD ERROR:', err);
          this.stats = null;
          this.error = 'Unable to load dashboard data.';
        },
      });
  }
}
