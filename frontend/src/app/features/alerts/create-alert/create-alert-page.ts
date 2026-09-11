import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from '../../../models';
import { CreateAlert } from './create-alert';

@Component({
  selector: 'app-create-alert-page',
  standalone: true,
  imports: [CreateAlert],
  template: `
    <section class="create-alert-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Monitoring</p>
          <h1>Create Alert</h1>
          <p>Submit a new monitoring alert to the system.</p>
        </div>
      </header>
      <div class="form-container">
        <app-create-alert
          (created)="onCreated($event)"
          (cancelled)="onCancelled()"
        />
      </div>
    </section>
  `,
  styles: [`
    .create-alert-page { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header .eyebrow { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--primary); margin-bottom: 0.25rem; }
    .page-header h1 { margin: 0 0 0.25rem; font-size: 1.75rem; }
    .page-header p { color: var(--text-secondary); margin: 0; }
    .form-container { background: var(--surface); border-radius: 12px;
      border: 1px solid var(--border); padding: 2rem; }
  `]
})
export class CreateAlertPage {
  constructor(private readonly router: Router) {}

  onCreated(alert: Alert): void {
    this.router.navigate(['/alerts', alert.id]);
  }

  onCancelled(): void {
    this.router.navigate(['/alerts']);
  }
}
