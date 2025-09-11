import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, FilterMatchMode, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { environment } from '../../../../../environments/environment';
import { Vehicle } from '../../../../core/Vehicle';
import { VehiculoService } from '../../../service/vehiculo.service';
import { ConfirmDialogModule, ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-eliminar-vehiculo',
  imports: [TableModule, IconFieldModule, InputTextModule, SkeletonModule, InputIconModule, Toast, ConfirmDialog],
  providers: [MessageService, ConfirmationService],
  templateUrl: './eliminar-vehiculo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EliminarVehiculoComponent implements OnInit{
  @ViewChild('dt2') dt2!: Table;
  filterMatchMode = FilterMatchMode.CONTAINS;
  public urlImage = environment.api;
  public loading = signal<boolean>(false);
  public vehicles = signal<Vehicle[] | null>(null);

  private vehicleService = inject(VehiculoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);


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
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Estás seguro de eliminar el vehículo?',
        header: 'Eliminar Vehículo',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Eliminar',
            severity: 'danger',
        },

        accept: () => {
          this.deleteVehiculo(event.data.id);
        }
    });
  }

  deleteVehiculo(id: number) {
    this.loading.set(true);
    this.vehicleService.deleteVehiculo(id).subscribe(
      (vehicles) => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Vehículo eliminado con éxito.' });
        this.getVehiculos();
        this.loading.set(false);
      },
      (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar vehículo.',
        });
      }
    );
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
