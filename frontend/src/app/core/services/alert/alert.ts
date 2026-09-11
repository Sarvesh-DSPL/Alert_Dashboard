import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { env } from '../../../environments/environment';
import { Alert, AlertFilters, CreateAlertPayload, UpdateAlertPayload } from '../../../models';

export interface AlertListResponse {
  items: Alert[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly apiUrl = env.alertServiceApiUrl;
  private readonly statusUpdatedSubject = new Subject<Alert>();
  readonly statusUpdated$ = this.statusUpdatedSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAlerts(filters?: AlertFilters): Observable<AlertListResponse> {
    let params = new HttpParams();
    if (filters?.search)     params = params.set('search',     filters.search);
    if (filters?.facilityId) params = params.set('facilityId', filters.facilityId.toString());
    if (filters?.severity)   params = params.set('severity',   filters.severity);
    if (filters?.status)     params = params.set('status',     filters.status);
    if (filters?.fromDate)   params = params.set('fromDate',   filters.fromDate);
    if (filters?.toDate)     params = params.set('toDate',     filters.toDate);
    return this.http.get<AlertListResponse>(this.apiUrl, { params });
  }

  getAlert(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/${id}`);
  }

  createAlert(payload: CreateAlertPayload): Observable<Alert> {
    return this.http.post<Alert>(this.apiUrl, payload);
  }

  updateAlert(id: number, payload: UpdateAlertPayload): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/${id}`, payload);
  }

  notifyStatusUpdated(alert: Alert): void {
    this.statusUpdatedSubject.next(alert);
  }

  getAlertOptions(): Observable<{ types: string[]; severities: string[]; statuses: string[] }> {
    return this.http.get<{ types: string[]; severities: string[]; statuses: string[] }>(
      `${this.apiUrl}/options`
    );
  }
}
