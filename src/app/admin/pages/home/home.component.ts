import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <div class="home">
    <div class="home-title"><p>Panel Administrativo</p></div>
    <div class="home-icon"><img src="assets/images/logo.png" alt="dvl-logo"></div>
    <div class="home-subtitle"><p>Bienvenido al panel administrativo del sitio web. Aquí podras realizar diferentes tareas, como gestión del contenido de la web o de usuarios.</p></div>
  </div>

  `,
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent { }
