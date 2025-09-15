import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../auth/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    private authService = inject(AuthService);

    ngOnInit() {
      const isSuper = this.authService.isSuperAdmin();
      const isAdmin = this.authService.isAdmin();

      // Secciones visibles solo para super admin
      const superAdminSections: MenuItem[] = isSuper
        ? [
            {
              label: 'Usuarios',
              items: [
                { label: 'Agregar Usuario', icon: 'pi pi-fw pi-user-plus', routerLink: ['/admin/agregar-usuario'] },
                { label: 'Editar Usuario', icon: 'pi pi-fw pi-users', routerLink: ['/admin/usuarios'] },
              ]
            }
          ]
        : [];

      const adminSections: MenuItem[] = isAdmin || isSuper
        ? [
            {
              label: 'Vehículos',
              items: [
                { label: 'Agregar Vehículo', icon: 'pi pi-fw pi-plus', routerLink: ['/admin/agregar-vehiculo'] },
                { label: 'Editar Vehículo', icon: 'pi pi-fw pi-pencil', routerLink: ['/admin/editar-vehiculo'] },
                { label: 'Eliminar Vehículo', icon: 'pi pi-fw pi-times', routerLink: ['/admin/eliminar-vehiculo'] },
              ]
            }
          ]
        : [];

      const commonSections: MenuItem[] = [
        {
          label: 'Formularios',
          icon: 'pi pi-fw pi-briefcase',
          items: [
            { label: 'Contactos', icon: 'pi pi-address-book', routerLink: ['/admin/contacto'] },
            { label: 'Reservas', icon: 'pi pi-receipt', routerLink: ['/admin/reserva'] },
          ]
        }
      ];

      this.model = [...superAdminSections, ...adminSections, ...commonSections];
  }
}
