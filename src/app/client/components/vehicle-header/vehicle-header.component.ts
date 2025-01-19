import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vehicle-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div class="flex flex-col w-full items-center">
      <img class="w-full z-10" src="assets/images/nissan.png" alt="nissan">
      <div class="text-box flex justify-between items-center w-4/6 ">
        <div class="text flex flex-col gap-2">
          <div class="title"><strong>Nissan Frontier</strong></div>
          <div class="description font-normal">Desde 22.000$/diarios</div>
        </div>
        <div class="icon cursor-pointer">
          <i class="pi pi-chevron-right" style="font-size: 2rem; color: white"></i>
        </div>
      </div>
    </div>

  `,
  styleUrl: './vehicle-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleHeaderComponent { }
