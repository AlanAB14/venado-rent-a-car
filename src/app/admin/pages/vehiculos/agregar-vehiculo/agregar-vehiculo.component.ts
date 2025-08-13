import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VehiculoStepperComponent } from "../../../components/vehiculo-stepper/vehiculo-stepper.component";

@Component({
  selector: 'app-agregar-vehiculo',
  imports: [VehiculoStepperComponent],
  templateUrl: './agregar-vehiculo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AgregarVehiculoComponent { }
