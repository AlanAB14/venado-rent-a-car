import { VehicleMainFeatures } from "./VehicleMainFeatures";
import { VehicleType } from "./VehicleType";

export interface Vehicle {
  id: number;
  name: string;
  description: null;
  images: string[];
  price_per_day: string;
  availability: boolean;
  updated_at: Date;
  deleteDate: null;
  main_features: VehicleMainFeatures;
  other_features: any[];
  vehicle_type: VehicleType[];
  updated_by: UpdatedBy;
}

export interface UpdatedBy {
  id: number;
  username: string;
}

