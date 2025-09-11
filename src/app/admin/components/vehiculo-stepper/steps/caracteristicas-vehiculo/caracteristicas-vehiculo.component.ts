import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { VehiculoService } from '../../../../service/vehiculo.service';
import { VehicleMainFeatures } from '../../../../../core/VehicleMainFeatures';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VehicleOtherFeature } from '../../../../../core/VehicleOtherFeature';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { concatMap, finalize, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';

export interface Message {
  severity: string;
  summary: string;
  detail: string;
}

@Component({
  selector: 'caracteristicas-vehiculo',
  imports: [CommonModule, FloatLabelModule,InputTextModule, InputNumberModule, DialogModule, TooltipModule, SelectModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './caracteristicas-vehiculo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    ::ng-deep .p-inputnumber-input {
      width:100%;
    }
  `]
})
export class CaracteristicasVehiculoComponent implements OnInit{
  public caracteristicasForm = input<FormGroup>();
  public mainFeaturesForm!: FormGroup;
  public otherFeaturesForm!: FormGroup;
  public emitMessage = output<Message>();
  public mainFeatures = signal<VehicleMainFeatures[] | null>(null);
  public otherFeatures = signal<VehicleOtherFeature[] | null>(null);
  public loading = signal<boolean>(false);
  public urlImage = environment.api;
  public mainFeaturesDialog = signal<boolean>(false);
  public otherFeatureDialog = signal<boolean>(false);
  public airOptions = [{ value: true, label: "SÍ" }, { value: false, label: "NO" }];
  public iconPreview = signal<string | null>(null);
  public gearBoxOptions = [{ value: "automatic", label: "Automático" }, { value: "manual", label: "Manual" }];

  private vehicleService = inject(VehiculoService);
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.getMainFeatures$().subscribe();
    this.getOtherFeatures$().subscribe();
    this.initMainFeaturesForm();
    this.initOtherFeaturesForm();

    const form = this.caracteristicasForm();

    if (form) {
      this.normalizeOtherFeaturesToIds(form);
    }
  }

  async sendMainFeature() {
    this.loading.set(true);
    this.addMainFeature$().pipe(
      concatMap(() => this.getMainFeatures$()),
      finalize(() => this.loading.set(false))
    )
    .subscribe({
      next: () => { },
      error: (error) => {
        console.error(error);
        this.emitMessage.emit({ severity: 'error', summary: 'Error', detail: 'Error al guardar/recargar características principales.' });
      }
    });
  }

  onIconChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.otherFeaturesForm.patchValue({ icon: file });
      this.otherFeaturesForm.get('icon')?.markAsDirty();
      this.otherFeaturesForm.updateValueAndValidity();

      // vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.iconPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  toggleOtherFeature(id: number) {
    const fa = this.otherFeaturesFA;
    const idx = fa.value.indexOf(id);
    if (idx !== -1) {
      fa.removeAt(idx);
    } else {
      fa.push(new FormControl<number>(id, { nonNullable: true }));
    }
    fa.markAsDirty();
  }

  get otherFeaturesFA(): FormArray<FormControl<number>> {
    return this.caracteristicasForm()!.get('other_features') as FormArray<FormControl<number>>;
  }

  isSelected(id: number): boolean {
    return this.otherFeaturesFA.value.includes(id);
  }

  async sendOtherFeature() {
    const formData = new FormData();
    if (this.otherFeaturesForm.value.title) formData.append('title', this.otherFeaturesForm.value.title);
    if (this.otherFeaturesForm.value.description) formData.append('description', this.otherFeaturesForm.value.description);
    if (this.otherFeaturesForm.value.icon instanceof File) formData.append('icon', this.otherFeaturesForm.value.icon);

    this.loading.set(true);
    // if (featureId) {
    //   this.updateOtherFeature(formData, featureId);
    // }else {
      this.addOtherFeature$(formData).pipe(
      concatMap(() => this.getOtherFeatures$()),
      finalize(() => this.loading.set(false))
    )
    .subscribe({
      next: () => { },
      error: (error) => {
        console.error(error);
        this.emitMessage.emit({ severity: 'error', summary: 'Error', detail: 'Error al guardar/recargar características secundarias.' });
      }
    });

    // }
  }

  private getMainFeatures$() {
    return this.vehicleService
      .getCaracteristicasPrincipales()
      .pipe(
        tap((mainFeatures) => this.mainFeatures.set(mainFeatures))
      );
  }

    private getOtherFeatures$() {
      return this.vehicleService
      .getCaracteristicasSecundarias()
      .pipe(
        tap((otherFeatures) => this.otherFeatures.set(otherFeatures))
      );
    }

    private addMainFeature$() {
      return this.vehicleService
        .setCaracteristicaPrincipal(this.mainFeaturesForm.value)
        .pipe(
          tap(() => {
            this.emitMessage.emit({ severity: 'success', summary: 'Agregado', detail: 'Características principales guardadas.' });
            this.mainFeaturesDialog.set(false);
            this.mainFeaturesForm.reset();
          })
        );
    }



  updateOtherFeature(formData:any, featureId: number) {

  }

  private normalizeOtherFeaturesToIds(form: FormGroup): void {
    const raw = form.value?.other_features ?? [];

    // Admite [number, ...] o [{id:number,...}, ...]
    const ids: number[] = (raw as any[])
      .map(x => typeof x === 'number' ? x : x?.id)
      .filter((v: unknown): v is number => typeof v === 'number');

    const fa = new FormArray<FormControl<number>>(
      ids.map(id => new FormControl<number>(id, { nonNullable: true }))
    );

    // Reemplaza el control (aunque ya exista) para garantizar tipo y valor
    form.setControl('other_features', fa);

    // Opcional: dejalo prolijo
    fa.markAsPristine();
    fa.markAsTouched();

    // OnPush: asegurá refresco visual
    this.cdr.markForCheck();
  }


  private addOtherFeature$(feature: any) {
    return this.vehicleService
      .setCaracteristicaSecundaria(feature)
      .pipe(
        tap(() => {
          this.emitMessage.emit({ severity: 'success', summary: 'Agregado', detail: 'Característica secundaria guardada.' });
          this.otherFeatureDialog.set(false);
          this.otherFeaturesForm.reset();
          this.iconPreview.set(null);
        })
      );
  }

  private initMainFeaturesForm() {
    this.mainFeaturesForm = new FormGroup({
      persons: new FormControl('', Validators.required),
      doors: new FormControl('', Validators.required),
      luggage: new FormControl('', Validators.required),
      air_conditioning: new FormControl('', Validators.required),
      gearbox: new FormControl('', Validators.required)
    })
  }

  private initOtherFeaturesForm() {
    this.otherFeaturesForm = new FormGroup({
      icon: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    })
  }
}
