import { ChangeDetectionStrategy, Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { Vehicle } from '../../../core/Vehicle';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'vehicle-card',
  imports: [
    ChipModule, CommonModule
  ],
  template: `
    <div class="card flex flex-col gap-4 animate-fade-in">
      <div class="box flex flex-col gap-20 rounded-xl p-5" [ngClass]="bgColor">
        <div class="heart ml-auto flex justify-center items-center p-3 bg-white rounded-full w-min h-min hover:cursor-pointer hover:opacity-85" (click)="onHeartClick($event)">
          <i class="pi pi-heart" [ngStyle]="{
            'color': favorite ? 'deeppink' : '#3C4242',
            'font-size': '1.5rem'
          }"></i>
        </div>
        <div class="image">
          <img [src]="url + vehicle()!.images[0]" alt="car-image">
        </div>
      </div>

      <div class="info flex justify-between items-center">
        <div class="text flex flex-col gap-1">
          <div class="model text-archivo text-[#3C4242] text-lg">{{ vehicle()?.name }}</div>
          <div class="type text-archivo text-[#807D7E] text-sm">{{ vehicleTypeLabel }}</div>
        </div>
        <p-chip class="text-archivo h-min" [label]="priceLabel" />
      </div>
    </div>

  `,
  styles: `
    .model {
      color: #3C4242;
      font-family: Archivo;
      font-style: normal;
      font-weight: 400;
    }

    @media (max-width: 640px) {
      .card {
        width: 75%;
      }
    }

    .card {
      &:hover {
        cursor:pointer;
        .box {
          box-shadow: 0px 8px 8px 0px rgba(0, 0, 0, 0.25);
          transform: translateY(-2px);
        }
      }
    }

    .box {
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      transition: all .2s;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  public vehicle = input<Vehicle>();
  @Input()  favorite?: boolean;
  @Output() toggleFavorite = new EventEmitter<number>();
  public url = environment.api;


  get vehicleTypeLabel(): string {
    const v = this.vehicle();
    if (!v || !Array.isArray(v.vehicle_type)) return '';

    return v.vehicle_type
      .map((obj: any) => {
        const t = obj?.type ?? '';
        return t.charAt(0).toUpperCase() + t.slice(1);
      })
      .join(' - ');
  }

  onHeartClick(event: Event) {
      event.stopPropagation();
      event.preventDefault();
    const id = this.vehicle()?.id;
    if (id != null) this.toggleFavorite.emit(id);
  }

  get priceLabel(): string | undefined {
    const raw = this.vehicle()?.price_per_day;
    if (raw == null) return undefined;

    const p = Number(raw); // 👈 conversión explícita
    if (isNaN(p)) return undefined;

    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(p);
  }

  get bgColor(): string {
    const v = this.vehicle();
    if (!v || !Array.isArray(v.vehicle_type)) return 'bg-[#725287]';

    if (v.vehicle_type.length > 1) {
      return 'bg-[#81BD41]'; // más de un tipo
    }

    const type = (v.vehicle_type[0]?.type ?? '').toLowerCase();
    if (type === 'particular') return 'bg-[#FEBF4E]';
    if (type === 'corporativo') return 'bg-[#725287]';

    return 'bg-[#725287]'; // fallback
  }

}
