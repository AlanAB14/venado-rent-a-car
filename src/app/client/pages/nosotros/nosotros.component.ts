import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  imports: [RouterModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NosotrosComponent { }
