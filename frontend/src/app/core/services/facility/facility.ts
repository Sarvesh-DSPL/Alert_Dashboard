import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facility } from '../../../models';
import { env } from '../../../environments/environment';

export interface FacilityAreaResponse {
  facilityId: number;
  areas: string[];
}

@Injectable({ providedIn: 'root' })
export class FacilityService {
  private readonly apiUrl = env.facilityServiceApiUrl;

  constructor(private readonly http: HttpClient) {}

  getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }

  getFacility(id: number): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}/${id}`);
  }

  getFacilityAreas(id: number): Observable<FacilityAreaResponse> {
    return this.http.get<FacilityAreaResponse>(`${this.apiUrl}/${id}/areas`);
  }
}
