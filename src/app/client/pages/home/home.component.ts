import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CardTypeVehicleComponent } from "../../components/card-type-vehicle/card-type-vehicle.component";
import { SearchBoxComponent } from "../../components/search-box/search-box.component";
import { ContactComponent } from "../../components/contact/contact.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    CardTypeVehicleComponent,
    SearchBoxComponent,
    ContactComponent,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent { }
