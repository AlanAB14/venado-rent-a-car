import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from '../../../admin/service/loading.service';
import { VehiculoService } from '../../../admin/service/vehiculo.service';
import { Vehicle } from '../../../core/Vehicle';
import { OnlyNumbersDirective } from "../../../core/directives/onlynumbers.directive";
import { ReservaService } from '../../../admin/service/reserva.service';

export interface ReservaPost {
  car: number;
  date_start: string;
  date_end: string;
  name: string;
  email: string;
  phone: string;
  observation?: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    TextareaModule,
    MessageModule,
    RouterModule,
    ToastModule,
    OnlyNumbersDirective
],
  providers: [MessageService],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class CheckoutComponent implements OnInit{
  public personalForm!: FormGroup;
  public dateForm!: FormGroup;
  public vehicle = signal<Vehicle | null>(null);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private routerParam = inject(ActivatedRoute);
  private loadingService = inject(LoadingService);
  private vehicleService = inject(VehiculoService);
  private reservationService = inject(ReservaService);
  private messageService = inject(MessageService);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    const id = Number(this.routerParam.snapshot.paramMap.get('id'));
    this.getVehicle(id);
  }

  activeStep: number = 1;

  initForm() {
    this.initPersonalForm();
    this.initDateForm();
  }

  initPersonalForm() {
    this.personalForm = this.fb.group({
      name: new FormControl<any>(null, [Validators.required]),
      email: new FormControl<null>(null, [Validators.required, Validators.email]),
      phone: new FormControl<null>(null, [Validators.required]),
    });
  }

  initDateForm() {
    this.dateForm = this.fb.group({
      date_start: new FormControl<any>(null, [Validators.required]),
      date_end: new FormControl<null>(null, [Validators.required]),
      observation: new FormControl<null>(null),
    });
  }

  confirmPurchease() {
    const reservaObj: ReservaPost = {
      car: this.vehicle()?.id!,
      date_start: this.dateForm.value.date_start,
      date_end: this.dateForm.value.date_end,
      observation: this.dateForm.value.observation,
      name: this.personalForm.value.name,
      email: this.personalForm.value.email,
      phone: this.personalForm.value.phone
    }
    this.postReservation(reservaObj);
  }

  private getVehicle(id: number) {
    this.loadingService.show();
    this.vehicleService.getVehiculo(id)
    .subscribe(vehiculo => {
      this.vehicle.set(vehiculo);
      this.loadingService.hide();
    }, (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer vehículo.' });
        this.loadingService.hide();
      })

    }

  get minEndDate(): Date | null {
    const start = this.dateForm.get('date_start')?.value;
    if (!start) return null;

    const nextDay = new Date(start);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }

  private postReservation(reservaObj: ReservaPost) {
    this.loadingService.show();
    this.reservationService.postReserva(reservaObj)
    .subscribe((reserva: any) => {
      console.log(reserva);
      this.loadingService.hide();
      Swal.fire({
        title: `Solicitud cargada ${ reserva ? '- ' + reserva.reservation_code : '' }`,
        text: "Nos comunicaremos con usted en un momento",
        icon: "success",
      }).then(() => {
        this.router.navigateByUrl('/')
      });
    }, (error) => {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar reserva.' });
      this.loadingService.hide();
    })
  }

}
