import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'search-box',
  imports: [
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    RouterModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="search-box flex flex-col gap-6 sm:gap-0 sm:flex-row justify-between items-center">
      <div class="form-section flex w-full">
        <form [formGroup]="searchForm" class="flex text-lato flex-col lg:flex-row justify-between gap-6 w-full sm:w-3/4">
          <p-floatlabel variant="on" class="w-full">
            <p-select [options]="vehicleTypes()" id="type" formControlName="vehicle_type" optionLabel="label" optionValue="value"  class="w-full" />
            <label for="type">Tipo</label>
          </p-floatlabel>
          <p-floatlabel variant="on" class="w-full">
            <input pInputText type="text" formControlName="name" id="makeModelLabel" class="w-full" />
            <label for="makeModelLabel">Marca/Modelo</label>
          </p-floatlabel>

<!--
          <p-floatlabel variant="on" class="w-full">
            <p-datepicker inputId="calendar-12h" id="dateStart" dateFormat="dd/mm/yy" formControlName="dateStart" styleClass="w-full"  [showTime]="true" [hourFormat]="'12'" />
            <label for="dateStart">Fecha de retiro</label>
          </p-floatlabel>

          <p-floatlabel variant="on" class="w-full">
            <p-datepicker inputId="calendar-12h" id="dateEnd" dateFormat="dd/mm/yy" formControlName="dateEnd" styleClass="w-full" [showTime]="true" />
            <label for="dateEnd">Fecha de devolución</label>
          </p-floatlabel> -->
        </form>
      </div>
      <div class="button-section">
        <button class="button-rent hover:opacity-80" (click)="onSearch()">Buscar</button>
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
        background: #3C5185;
        color: #FEFEFE;
      }
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit{
  @Input()  mode: 'emit' | 'navigate' = 'emit';
  @Input()  initialFilters?: { vehicle_type?: string; name?: string };   // 👈 NUEVO
  @Output() search = new EventEmitter<{ vehicle_type?: string; name?: string }>();

  public vehicleTypes = signal([
    { value: 'particular',  label: 'Particular' },
    { value: 'corporativo', label: 'Corporativo' },
    { value: 'favoritos',   label: 'Favoritos' },
    { value: 'todos',       label: 'Todo' }
  ]);

  public searchForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      vehicle_type: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null),
    });

    // Si ya vino initialFilters antes de ngOnInit (caso raro), aplicarlos:
    if (this.initialFilters) this.patchFromInitial(this.initialFilters);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialFilters'] && this.searchForm) {
      this.patchFromInitial(changes['initialFilters'].currentValue);
    }
  }

  private patchFromInitial(f: { vehicle_type?: string; name?: string }) {
    // Si el type viene indefinido → null en el form. Si viene algo distinto a 'todos', setearlo.
    const typeValue = f?.vehicle_type ?? null;
    this.searchForm.patchValue(
      { vehicle_type: typeValue, name: f?.name ?? null },
      { emitEvent: false }
    );
  }

  onSearch() {
    const filters = this.buildFilters();
    if (this.mode === 'emit') {
      this.search.emit(filters);
    } else {
      this.router.navigate(['/flota'], { queryParams: filters });
    }
  }

  private buildFilters(): { vehicle_type?: string; name?: string } {
    const { vehicle_type, name } = this.searchForm.value;
    return {
      vehicle_type: vehicle_type && vehicle_type !== 'todos' ? vehicle_type : undefined,
      name: name?.trim() || undefined,
    };
  }
}
