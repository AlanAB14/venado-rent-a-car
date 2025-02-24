import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'vehicle-card',
  imports: [
    ChipModule
  ],
  template: `
    <div class="card flex flex-col gap-4">
      <div class="box flex flex-col gap-20 rounded-xl p-5 bg-[#725287]">
        <div class="heart ml-auto flex justify-center items-center p-3 bg-white rounded-full w-min h-min hover:cursor-pointer hover:opacity-85">
          <i class="pi pi-heart" style="color: #3C4242; font-size: 1.5rem"></i>
        </div>
        <div class="image -mr-5">
          <img src="assets/images/corolla.png" alt="car-image">
        </div>
      </div>

      <div class="info flex justify-between items-center">
        <div class="text flex flex-col gap-1">
          <div class="model text-archivo text-[#3C4242] text-lg">Toyota Etios SE</div>
          <div class="type text-archivo text-[#807D7E] text-sm">Particular</div>
        </div>
        <p-chip class="text-archivo h-min" label="$123.00" />
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
export class VehicleCardComponent { }
