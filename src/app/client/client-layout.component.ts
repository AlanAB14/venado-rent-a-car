import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClientLayoutComponent { }
