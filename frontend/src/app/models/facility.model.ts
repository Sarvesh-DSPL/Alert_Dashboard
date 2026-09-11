
export interface Facility {
  id: number;
  name: string;
  location: string;
  areaCount: number;
  cameraCount: number;
  activeAlertCount: number;
  createdAt?: string;
  updatedAt?: string;
  areas?: string[];
}
