import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { VehicleType } from '../../../core/VehicleType';
import { VehiculoService } from '../../service/vehiculo.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatosVehiculoComponent } from "./steps/datos-vehiculo/datos-vehiculo.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CaracteristicasVehiculoComponent } from "./steps/caracteristicas-vehiculo/caracteristicas-vehiculo.component";

@Component({
  selector: 'vehiculo-stepper',
  imports: [StepperModule, ButtonModule, ToastModule, DatosVehiculoComponent, CaracteristicasVehiculoComponent],
  providers: [MessageService],
  templateUrl: './vehiculo-stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiculoStepperComponent implements OnInit{
  public vehicleTypes = signal<VehicleType[] | null>(null);
  public loading = signal<boolean>(false);
  public datosForm!: FormGroup;
  public caracteristicasForm!: FormGroup;

  private vehicleService = inject(VehiculoService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getVehicleTypes();
    this.initDatosForm();
    this.initCaracteristicasForm();
  }

  private getVehicleTypes() {
    this.loading.set(true);
    this.vehicleService.getTipoDeVehiculo()
      .subscribe((vehicleTypes) => {
      this.vehicleTypes.set(vehicleTypes);
      this.loading.set(false);
    }, (error) => {
      this.loading.set(false);
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer tipo de vehículos.' });
    })
  }

  private initDatosForm() {
    this.datosForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      vehicle_type: new FormControl('', Validators.required),
      price_per_day: new FormControl(0, [Validators.required, Validators.min(1)]),
      description: new FormControl(''),
      availability: new FormControl(1)
    })
  }

  private initCaracteristicasForm() {
    this.caracteristicasForm = new FormGroup({
      persons: new FormControl('', [Validators.required]),
      doors: new FormControl('', [Validators.required]),
      luggage: new FormControl('', [Validators.required]),
      air_conditioning: new FormControl('', [Validators.required]),
      gearbox: new FormControl('', [Validators.required])
    })
  }
}
