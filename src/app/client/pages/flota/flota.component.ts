import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VehicleCardComponent } from "../../components/vehicle-card/vehicle-card.component";
import { SearchBoxComponent } from "../../components/search-box/search-box.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-flota',
  imports: [VehicleCardComponent, SearchBoxComponent, RouterModule],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FlotaComponent { }
