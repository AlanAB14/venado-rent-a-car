import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'contact',
  imports: [ReactiveFormsModule, TextareaModule, InputTextModule],
  template: `
    <div class="contact-box w-full">
      <div class="contact-box__content flex flex-col lg:flex-row justify-around xl:justify-between gap-16">
        <div class="contact-box__content__form w-full sm:w-3/4 mx-auto lg:mx-0 lg:w-2/4">
          <form [formGroup]="contactForm" class="flex text-lato flex-col gap-6">
            <div class="personal-data flex flex-col sm:flex-row gap-6">
              <div class="flex flex-col w-full gap-2">
                <label class="label-box" for="username">Nombre y Apellido</label>
                <input pInputText id="username" aria-describedby="username-help" formControlName="name" />
              </div>
              <div class="flex flex-col w-full gap-2">
                <label class="label-box" for="email">Email</label>
                <input pInputText id="email" aria-describedby="username-help" formControlName="email" />
              </div>
            </div>
            <div class="message flex flex-col gap-2 w-full">
              <label class="label-box" for="message">Mensaje</label>
              <textarea rows="5" id="message" cols="30" pTextarea formControlName="message"></textarea>
            </div>
            <div class="button-section mx-auto sm:mx-0">
              <button class="button-rent hover:opacity-80">Enviar</button>
            </div>
          </form>
        </div>
        <div class="contact-box__content__info flex flex-row flex-wrap lg:flex-nowrap lg:flex-col justify-start ml-4 sm:ml-0 sm:justify-around lg:justify-start gap-6 w-full lg:w-1/4">
          <div class="box flex flex-col gap-2">
            <div class="title flex items-center gap-4">
              <i class="pi pi-clock" style="font-size: 1.5rem; color: #BDDB64"></i>
              <p class="title-box">Horarios de atención</p>
            </div>
            <div class="description">
                Lunes - Viernes : 8 AM - 5 PM
            </div>
          </div>
          <div class="box flex flex-col gap-2">
            <div class="title flex items-center gap-4">
              <i class="pi pi-envelope" style="font-size: 1.5rem; color: #BDDB64"></i>
              <p class="title-box">Email</p>
            </div>
            <div class="description">
              info&#64;venadorentacar.com.ar
            </div>
          </div>
          <div class="box flex flex-col gap-2">
            <div class="title flex items-center gap-4">
              <i class="pi pi-phone" style="font-size: 1.5rem; color: #BDDB64"></i>
              <p class="title-box">Teléfono</p>
            </div>
            <div class="description">
              <p>(03462) 435925 / 437437</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`

    .contact-box {
      .button-section {
        button {
          background: #FF9900;
          color: #FEFEFE;
        }
      }
      .label-box {
        color: var(--Text-Title, #1D2B4F);
        font-family: Archivo;
        font-size: .875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.5rem; /* 171.429% */
        margin-left: .12rem;
      }

      &__content {
        .title-box {
          color: var(--Text-Title, #1D2B4F);
          font-variant-numeric: lining-nums proportional-nums;
          font-family: Archivo;
          font-size: 1.5rem;
          font-style: normal;
          font-weight: 700;
          line-height: 2rem; /* 133.333% */
        }

        .description {
          color: var(--Text-Body, #626262);
          font-variant-numeric: lining-nums proportional-nums;
          font-family: Archivo;
          font-size: 1rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.6875rem; /* 168.75% */
        }
      }
    }

  `]
})
export class ContactComponent {
  public contactForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required),
    });
  }
}
