export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const ALERT_STATUSES = ['Active', 'Acknowledged', 'Resolved'] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const DEFAULT_ALERT_TYPES = [
  'Motion Detection',
  'Unauthorized Access',
  'Fire Detection',
  'Camera Offline',
  'Intrusion Detection',
  'Equipment Failure',
  'Temperature Alert',
] as const;

export interface Alert {
  id: number;
  type: string;
  facilityId: number;
  facilityName: string;
  area: string;
  severity: Severity;
  status: AlertStatus;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AlertFilters {
  search?: string;
  facilityId?: number;
  severity?: Severity;
  status?: AlertStatus;
  fromDate?: string;
  toDate?: string;
}

export interface CreateAlertPayload {
  type: string;
  facilityId: number;
  area: string;
  severity: Severity;
  description: string;
}

export interface UpdateAlertPayload {
  status?: AlertStatus;
  severity?: Severity;
  description?: string;
}