import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface ItemMenu {
  path: string;
  text: string;
}

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  isExpanded: boolean = false;


  items: ItemMenu[] = [
    {
      path: 'flota',
      text: 'Flota'
    },
    {
      path: 'nosotros',
      text: 'Nosotros'
    },
    {
      path: 'empresas',
      text: 'Empresas'
    },
    {
      path: 'contacto',
      text: 'Contacto'
    }
  ];

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

}
