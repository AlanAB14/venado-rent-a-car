export interface VehicleMainFeatures {
  id: number;
  persons: number;
  doors: number;
  luggage: number;
  air_conditioning: boolean;
  gearbox: GearboxType;
}

export enum GearboxType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual'
}
