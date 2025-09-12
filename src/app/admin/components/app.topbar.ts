import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationsService } from '../service/notifications.service';
import { Subscription } from 'rxjs';
import { Popover, PopoverModule } from 'primeng/popover';
import { UserNotification } from '../../core/UserNotification';
@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, BadgeModule, OverlayBadgeModule, CommonModule, PopoverModule, CommonModule],
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
                <button type="button" class="layout-topbar-action"  (click)="op.toggle($event)">
                    <p-overlaybadge [value]="notifications()" [badgeDisabled]="notifications() === 0 ? true : false ">
                        <i class="pi pi-bell"></i>
                    </p-overlaybadge>
                </button>

                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>


                <p-popover
                  #op
                  appendTo="body"
                  [dismissable]="true">
                  <div class="flex flex-col gap-4">
                      <div>
                          <ul class="list-none p-0 m-0 flex flex-col">
                              <li *ngFor="let notification of userNotifications()" class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border" >
                                  <div>
                                      <span class="font-medium">Solicitud de {{ notification.type }}</span>
                                      <div class="text-sm text-surface-500 dark:text-surface-400">Tienes una solicitud de {{ notification.user }} - {{ notification.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
                </p-popover>
            </div>

            <!-- <div class="layout-topbar-menu hidden lg:block">
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
            </div> -->
        </div>
    </div>`
})
export class AppTopbar implements OnInit{
    items!: MenuItem[];
    public notifications = signal<number>(0);
    public userNotifications = signal<UserNotification[]>([]);
    private notif = inject(NotificationsService);
    private sub?: Subscription;
    @ViewChild('op') op!: Popover;
    constructor(public layoutService: LayoutService) {}

    ngOnInit(): void {
      this.sub = this.notif.onContactCreated<any>().subscribe(c => {
        console.log(c, 'llego una nueva notificacion');
        this.notifications.set(this.notifications() + 1);
        this.getNotifications();
        // acá también podés refrescar la tabla si querés
        // this.contactsService.getContactForms().subscribe(...)
      });

      this.getNotifications();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    getNotifications() {
      this.notif.getNotifications().subscribe((userNotifications) => {
        this.userNotifications.set(userNotifications);
      }, (error) => {
        console.error('Error fetching notifications', error);
      });
    }

    ngOnDestroy(): void {
      this.sub?.unsubscribe();
    }

    toggle(event: any) {
      this.op.toggle(event);
    }
}
