import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { VehicleType } from '../../../core/VehicleType';
import { VehiculoService } from '../../service/vehiculo.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatosVehiculoComponent } from "./steps/datos-vehiculo/datos-vehiculo.component";
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CaracteristicasVehiculoComponent } from "./steps/caracteristicas-vehiculo/caracteristicas-vehiculo.component";
import { ImagenesVehiculoComponent } from "./steps/imagenes-vehiculo/imagenes-vehiculo.component";
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Vehicle } from '../../../core/Vehicle';

@Component({
  selector: 'vehiculo-stepper',
  imports: [StepperModule, ButtonModule, ToastModule, DatosVehiculoComponent, CaracteristicasVehiculoComponent, ImagenesVehiculoComponent],
  providers: [MessageService],
  templateUrl: './vehiculo-stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiculoStepperComponent implements OnInit{
  public vehicleSelected = input<Vehicle | null>();
  public vehicleTypes = signal<VehicleType[] | null>(null);
  public loading = signal<boolean>(false);
  public datosForm!: FormGroup;
  public caracteristicasForm!: FormGroup;
  public imagenesForm!: FormGroup;
  public filesCache = signal<File[]>([]);
  public removedExisting = signal<string[]>([]);

  private vehicleService = inject(VehiculoService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getVehicleTypes();
    this.initDatosForm();
    this.initCaracteristicasForm();
    this.initImagenesForm();
  }

  emitMessage(message: any) {
    this.messageService.add(message);
  }

  volver() {
    this.router.navigateByUrl('/admin')
  }

  agregarEditarVehiculo() {
    const vehicleObj = {
      ...this.datosForm.value,
      ...this.caracteristicasForm.value,
      price_per_day: Number(this.datosForm.value.price_per_day),
      main_features: this.caracteristicasForm.value.main_features != null
        ? Number(this.caracteristicasForm.value.main_features) : undefined,
      other_features: (this.caracteristicasForm.value.other_features ?? []).map(Number),
      vehicle_type: Array.isArray(this.datosForm.value.vehicle_type)
        ? this.datosForm.value.vehicle_type.map(Number)
        : [Number(this.datosForm.value.vehicle_type)],
      images: this.filesCache(),
    };

    if (this.vehicleSelected()?.id) {
      this.updateVehicle(vehicleObj, this.vehicleSelected()!.id)
    }else {
      this.setVehicle(vehicleObj);
    }
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

  private setVehicle(vehicleObj: any) {
    this.loading.set(true);

    this.vehicleService.setVehiculo(vehicleObj)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Vehículo ingresado con éxito.', life: 2000 });
          setTimeout(() => this.router.navigateByUrl('admin'), 2000);
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.status === 400 ? error.error.message : 'Error al ingresar vehículo.'
          });
        }
      });
  }

  private updateVehicle(vehicleObj: any, id: number) {
  this.loading.set(true);

  this.vehicleService.patchVehiculo(vehicleObj, id)
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Editado', detail: 'Vehículo editado con éxito.', life: 2000 });
        setTimeout(() => this.router.navigateByUrl('admin'), 2000);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.status === 400 ? error.error.message : 'Error al editar vehículo.'
        });
      }
    });
  }

  private initDatosForm() {
    const v = this.vehicleSelected();

    this.datosForm = new FormGroup({
      name: new FormControl(v?.name ?? '', [Validators.required]),
      vehicle_type: new FormControl<number[]>(
        v?.vehicle_type?.map(t => t.id) ?? [],
        { validators: [Validators.required] }
      ),
      price_per_day: new FormControl(v?.price_per_day ? Number(v.price_per_day) : 0, {
        validators: [Validators.required, Validators.min(1)],
      }),
      description: new FormControl(v?.description ?? ''),
      availability: new FormControl(!v?.availability ? 0 : 1 ),
    });
  }


  private initCaracteristicasForm() {
    const v = this.vehicleSelected();
    const mainId = v?.main_features?.id ?? null;
    const otherFeaturesControls: FormControl<number>[] =
      (v?.other_features ?? []).map((n: number) =>
        new FormControl<number>(n, { nonNullable: true })
      );

    this.caracteristicasForm = new FormGroup({
      main_features: new FormControl<number | null>(mainId, {
        validators: [Validators.required],
      }),
      other_features: new FormArray<FormControl<number>>(otherFeaturesControls),
    });
  }

  private initImagenesForm() {
    const imagesControls: FormControl<string>[] = (this.vehicleSelected()?.images ?? []).map(
        img => new FormControl<string>(img, { nonNullable: true, validators: [Validators.required] })
      );

    this.imagenesForm = new FormGroup({
      images: new FormArray<FormControl<string>>(imagesControls, { validators: [Validators.required] })
    });
  }
}
