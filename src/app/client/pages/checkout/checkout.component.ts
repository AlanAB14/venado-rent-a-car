import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButton } from 'primeng/togglebutton';
import { IconField } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    ToggleButton,
    IconField,
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    TextareaModule,
    MessageModule,
    RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckoutComponent {
  public personalForm!: FormGroup;
  public dateForm!: FormGroup;
  public loading: boolean = false;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.initForm();
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
      date_end: new FormControl<null>(null),
      observation: new FormControl<null>(null),
    });
  }

  confirmPurchease() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      Swal.fire({
        title: "Solicitud cargada!",
        text: "Nos comunicaremos con usted en un momento",
        icon: "success",
      }).then(() => {
        this.router.navigateByUrl('/')
      });
    }, 2000);
  }
}
