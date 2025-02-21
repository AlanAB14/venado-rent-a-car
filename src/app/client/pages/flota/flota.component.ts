import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VehicleCardComponent } from "../../components/vehicle-card/vehicle-card.component";
import { SearchBoxComponent } from "../../components/search-box/search-box.component";

@Component({
  selector: 'app-flota',
  imports: [VehicleCardComponent, SearchBoxComponent],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FlotaComponent { }
