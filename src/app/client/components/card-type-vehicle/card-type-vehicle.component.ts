import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'card-type-vehicle',
  imports: [RouterModule],
  template: `

    <div class="card h-full p-8 flex" [style]="'background-image: ' + bgColor()">
      <div class="text flex flex-col">
        <div class="upper-title">VEHÍCULOS</div>
        <div class="title">{{ title() }}</div>
        <div class="link-text mt-auto cursor-pointer"><a routerLink="/flota">Conocé más</a></div>
      </div>
      <div class="image">
        <img [src]="'assets/images/' + image()" alt="">
      </div>
    </div>

  `,
  styleUrl: './card-type-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTypeVehicleComponent {
  public image = input<string>('');
  public title = input<string>('');
  public bgColor = input<string>('');
  public link = input<string>('');
}
