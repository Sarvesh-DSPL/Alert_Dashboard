import { Alert } from './alert.model';

export interface DashboardStats {
  total: number;
  critical: number;
  active: number;
  resolved: number;
  acknowledged: number;
  recentAlerts: Alert[];
}
