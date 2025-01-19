import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VehicleHeaderComponent } from "../vehicle-header/vehicle-header.component";

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    CommonModule,
    VehicleHeaderComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent { }
