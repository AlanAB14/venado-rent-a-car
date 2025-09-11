import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationsService } from '../service/notifications.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, BadgeModule, OverlayBadgeModule, CommonModule, StyleClassModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo bg-slate-500 w-12 rounded-full!" routerLink="/">
                <img src="assets/images/logo-icon.png" class="p-3" alt="">
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>

                <button type="button" class="layout-topbar-action">
                    <p-overlaybadge [value]="notifications()" [badgeDisabled]="notifications() === 0 ? true : false ">
                        <i class="pi pi-bell"></i>
                    </p-overlaybadge>
                </button>

            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit{
    items!: MenuItem[];
    public notifications = signal<number>(0);

    private notif = inject(NotificationsService);
    private sub?: Subscription
    ;
    constructor(public layoutService: LayoutService) {}

    ngOnInit(): void {
      this.sub = this.notif.onContactCreated<any>().subscribe(c => {
        this.notifications.set(this.notifications() + 1);
        // acá también podés refrescar la tabla si querés
        // this.contactsService.getContactForms().subscribe(...)
      });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    ngOnDestroy(): void {
      this.sub?.unsubscribe();
    }
}
