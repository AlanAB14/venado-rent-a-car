import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VehicleCardComponent } from "../../components/vehicle-card/vehicle-card.component";

@Component({
  selector: 'app-flota',
  imports: [VehicleCardComponent],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FlotaComponent { }
