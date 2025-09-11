import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { VehiculoService } from '../../../service/vehiculo.service';
import { Vehicle } from '../../../../core/Vehicle';
import { FilterMatchMode, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { InputTextModule } from 'primeng/inputtext';
import { VehiculoStepperComponent } from "../../../components/vehiculo-stepper/vehiculo-stepper.component";

@Component({
  selector: 'app-editar-vehiculo',
  imports: [
    TableModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    VehiculoStepperComponent
],
  providers: [MessageService],
  templateUrl: './editar-vehiculo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    tr {
      cursor: pointer;
    }
    `]
})
export default class EditarVehiculoComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  filterMatchMode = FilterMatchMode.CONTAINS;
  public urlImage = environment.api;
  public loading = signal<boolean>(false);
  public vehicles = signal<Vehicle[] | null>(null);
  public vehicleSelected = signal<Vehicle | null>(null);
  private vehicleService = inject(VehiculoService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getVehiculos();
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, this.filterMatchMode);
    }
  }

  onRowSelect(event: any) {
    this.vehicleSelected.set(event.data);
  }

  getVehiculos() {
    this.loading.set(true);
    this.vehicleService.getVehiculos().subscribe(
      (vehicles) => {
        this.vehicles.set(vehicles);
        this.loading.set(false);
      },
      (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener vehículos.',
        });
      }
    );
  }
}
