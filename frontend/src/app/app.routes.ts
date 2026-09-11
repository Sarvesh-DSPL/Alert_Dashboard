import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alert-list/alert-list').then((m) => m.AlertList),
  },
  {
    path: 'alerts/new',
    loadComponent: () =>
      import('./features/alerts/create-alert/create-alert-page').then(
        (m) => m.CreateAlertPage
      ),
  },
  {
    path: 'alerts/:id',
    loadComponent: () =>
      import('./features/alerts/alert-details/alert-details').then(
        (m) => m.AlertDetails
      ),
  },
  {
    path: 'facilities',
    loadComponent: () =>
      import(
        './features/facilities/facility-list/facility-list/facility-list'
      ).then((m) => m.FacilityList),
  },
  {
    path: 'facilities/:id',
    loadComponent: () =>
      import(
        './features/facilities/facility-details/facility-details/facility-details'
      ).then((m) => m.FacilityDetails),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
