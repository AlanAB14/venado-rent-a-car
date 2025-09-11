import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ConfirmationService,
  FilterMatchMode,
  MessageService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ReservaService } from '../../service/reserva.service';
import { Reservation } from '../../../core/Reservation';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

registerLocaleData(localeEsAr, 'es-AR');

@Component({
  selector: 'app-reserva',
  imports: [
    TableModule,
    ConfirmPopupModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    CommonModule
  ],
  providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-AR' }],
  templateUrl: './reserva.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReservaComponent implements OnInit{
  @ViewChild('dt2') dt2!: Table;
  filterMatchMode = FilterMatchMode.CONTAINS;
  public loading = signal<boolean>(false);
  public reservasForm = signal<Reservation[]>([]);
  public reservaSelected = signal<Reservation | null>(null);

  private messageService = inject(MessageService);
  private reservationService = inject(ReservaService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.getReservaForms();
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, this.filterMatchMode);
    }
  }

  onRowSelect(event: any) {
    this.reservaSelected.set(event.data);
  }

  eliminarContact(event: Event) {
    this.confirmationService.confirm({
        target: event.currentTarget as EventTarget,
        message: '¿Estás seguro de borrar la reserva?',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Borrar',
            severity: 'danger'
        },
        accept: () => {
          this.deleteReservaForm(this.reservaSelected()?.id!);
          this.reservaSelected.set(null);
        },
    });
  }

  getReservaForms() {
    this.loading.set(true);
    this.reservationService.getReservas().subscribe(
      (reservas) => {
        this.reservasForm.set(reservas);
        this.loading.set(false);
      },
      (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener reservas.',
        });
      }
    );
  }

  deleteReservaForm(id: number) {
    this.loading.set(true);
    this.reservationService.deleteReserva(id)
    .subscribe((contactForms) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Reserva eliminada con éxito.',
        });
        this.getReservaForms();
      },
      (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar reserva.',
        });
      }
    );
  }
}
