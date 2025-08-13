import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VehicleType } from '../../../../../core/VehicleType';
import { FormGroup, ReactiveFormsModule,  } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'datos-vehiculo',
  imports: [FloatLabelModule, InputNumberModule, MultiSelectModule, InputTextModule, TextareaModule, SelectModule, ReactiveFormsModule],
  templateUrl: './datos-vehiculo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DatosVehiculoComponent {
  public vehicleTypes = input<VehicleType[] | null>();
  public datosForm = input<FormGroup>();
  public availabilityTypes = [{id: 0,text: 'No disponible'},{id: 1,text: 'Disponible'}];
}
