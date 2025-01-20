import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'search-box',
  imports: [
    SelectModule,
    FloatLabelModule,
    DatePickerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="search-box flex justify-between items-center">
      <div class="form-sectionflex w-full">
        <form [formGroup]="searchForm" class="flex flex-col lg:flex-row justify-between gap-6 w-3/4">
          <p-floatlabel variant="on" class="w-full">
            <p-select [options]="vehicleTypes()" id="type" formControlName="type" optionLabel="label" optionValue="value"  class="w-full " />
            <label for="type">Tipo</label>
          </p-floatlabel>

          <p-floatlabel variant="on" class="w-full">
            <p-datepicker inputId="calendar-12h" id="dateStart" dateFormat="dd/mm/yy" formControlName="dateStart" styleClass="w-full"  [showTime]="true" [hourFormat]="'12'" />
            <label for="dateStart">Fecha de retiro</label>
          </p-floatlabel>

          <p-floatlabel variant="on" class="w-full">
            <p-datepicker inputId="calendar-12h" id="dateEnd" dateFormat="dd/mm/yy" formControlName="dateEnd" styleClass="w-full" [showTime]="true" />
            <label for="dateEnd">Fecha de devolución</label>
          </p-floatlabel>
        </form>
      </div>
      <div class="button-section">
        <button class="hover:opacity-80">Buscar</button>
      </div>
    </div>

  `,
  styles: [
    `

    .search-box {
      border-radius: .125rem;
      background: #FFF;
      box-shadow: 0rem 1.9375rem 5.0625rem 0rem rgba(37, 37, 37, 0.07);
      padding: 1rem 2rem;
    }

    .button-section {
      button {
        padding: .75rem 3rem;
        border-radius: 2.5rem;
        background: #3C5185;
        color: #FEFEFE;
        text-align: center;
        font-family: Archivo;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 180%; /* 2.7rem */
      }
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit{

  public vehicleTypes = signal<any[]>([
    {
      value: 0,
      label: 'Particular'
    },
    {
      value: 1,
      label: 'Corporativo'
    },
    {
      value: 2,
      label: 'Todo'
    }
  ]);
  public searchForm!: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  initForm() {
    this.searchForm = this.fb.group({
      type: new FormControl<any>(null, [Validators.required]),
      dateStart: new FormControl<Date[] | null>(null, [Validators.required]),
      dateEnd: new FormControl<Date[] | null>(null, [Validators.required]),
    })
  }
}
