import { ChangeDetectorRef, Component, computed, inject, NgZone, OnInit, signal, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationsService } from '../service/notifications.service';
import { Subscription } from 'rxjs';
import { Popover, PopoverModule } from 'primeng/popover';
import { UserNotification } from '../../core/UserNotification';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, ButtonModule, BadgeModule, OverlayBadgeModule, CommonModule, PopoverModule, CommonModule],
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
                <button type="button" class="layout-topbar-action"  (click)="onBellClick($event)">
                  @if (notifications() > 0) {
                    <p-overlaybadge [value]="notifications()">
                        <i class="pi pi-bell"></i>
                      </p-overlaybadge>
                  }@else {
                    <i class="pi pi-bell"></i>
                  }
                </button>

                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>


                <p-popover
                  #op
                  appendTo="body"
                  [dismissable]="true">
                  <div class="flex flex-col gap-4">
                      <div class="max-h-80 overflow-y-auto">
                          <ul class="list-none p-0 m-0 flex flex-col">
                            @if (decoratedNotifications().length > 0) {
                              @for (notification of decoratedNotifications(); track $index) {
                                <li [ngClass]="notification.__unread ? 'bg-slate-300 dark:bg-slate-800/60' : ''" class="flex justify-between items-center gap-2 px-2 py-3 hover:bg-slate-200 cursor-pointer rounded-border" (click)="onNotificationClick(notification)">
                                    <div>
                                        <span class="font-medium">Solicitud de {{ notification.type }}</span>
                                        <div class="text-sm text-surface-500 dark:text-surface-400">Tienes una solicitud de {{ notification.user }} - {{ notification.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
                                    </div>
                                    <div>
                                      <p-button icon="pi pi-trash" (onClick)="onDeleteClick($event, notification)" [rounded]="true" [text]="true" />
                                    </div>
                                </li>
                              }
                            }@else {
                              <li>
                                <div>
                                  <span class="font-medium">No hay notificaciones</span>
                                </div>
                              </li>
                            }
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
    public notifications = computed(() => this.unreadIds().size)
    public userNotifications = signal<UserNotification[]>([]);
    public decoratedNotifications = computed(() => {
      const list = this.userNotifications();
      const unread = this.unreadIds();
      return list.map(n => ({ ...n, __unread: unread.has(n.id) }));
    });

    private readonly LS_UNREAD_IDS_KEY = 'topbar.unreadIds';
    public unreadIds = signal<Set<number>>(new Set<number>());
    private notif = inject(NotificationsService);
    private sub?: Subscription;
    private zone = inject(NgZone);
    private router = inject(Router);
    @ViewChild('op') op!: Popover;
    constructor(public layoutService: LayoutService) {}

    ngOnInit(): void {
      this.unreadIds.set(this.readUnreadIdsFromStorage());

      this.sub = this.notif.onContactCreated<any>().subscribe(c => {
        console.log(c, 'llego una nueva notificacion');
        this.zone.run(() => {
          if (c?.id != null) {
            const next = new Set(this.unreadIds());
            next.add(c.id);
            this.unreadIds.set(next);
            this.writeUnreadIdsToStorage(next);
          }         // <-- persistir contador
          this.getNotifications();
        });
        // acá también podés refrescar la tabla si querés
        // this.contactsService.getContactForms().subscribe(...)
      });

      this.getNotifications();
    }

    onBellClick(event: Event) {
      this.op.toggle(event);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

  getNotifications() {
    this.notif.getNotifications().subscribe({
      next: (list) => {
        this.userNotifications.set(list);

        // LIMPIEZA: si el set tiene IDs que ya no existen (borradas en backend), sacarlos
        const existingIds = new Set(list.map((n: any) => n.id));
        const next = new Set<number>();
        for (const id of this.unreadIds()) if (existingIds.has(id)) next.add(id);
        if (next.size !== this.unreadIds().size) {
          this.unreadIds.set(next);
          this.writeUnreadIdsToStorage(next);
        }
      },
      error: (error) => console.error('Error fetching notifications', error)
    });
  }

    ngOnDestroy(): void {
      this.sub?.unsubscribe();
    }

    toggle(event: any) {
      this.onBellClick(event);
    }

    public markAsRead(id: number) {
      const next = new Set(this.unreadIds());
      if (next.delete(id)) {
        this.unreadIds.set(next);
        this.writeUnreadIdsToStorage(next);
      }
    }

    public trashNotification(ev: Event, id: number) {
     ev.stopPropagation();
     this.markAsRead(id);
      // Si además querés borrarla del listado (solo UI):
      // this.userNotifications.set(this.userNotifications().filter(n => n.id !== id));
      // O si querés borrarla en backend, acá llamás a un delete y luego refrescás.
    }

  private readUnreadIdsFromStorage(): Set<number> {
    try {
      const raw = localStorage.getItem(this.LS_UNREAD_IDS_KEY);
      const arr = raw ? JSON.parse(raw) as number[] : [];
      return new Set(arr.filter(n => Number.isFinite(n)));
    } catch { return new Set<number>(); }
  }

  private writeUnreadIdsToStorage(set: Set<number>): void {
    try {
      localStorage.setItem(this.LS_UNREAD_IDS_KEY, JSON.stringify([...set]));
    } catch {}
  }

  onNotificationClick(notification: UserNotification) {
    // 1) marcar como leída (la saca de notificaciones nuevas)
    this.markAsRead(notification.id);

    // 2) navegar según tipo
    if (notification.type === 'contacto') {
      this.router.navigateByUrl('admin/contacto');
    } else if (notification.type === 'reserva') {
      this.router.navigateByUrl('admin/reserva');
    }

    // 3) cerrar el popover (PrimeNG Popover expone hide())
    this.op?.hide();
  }

  onDeleteClick(ev: Event, notification: UserNotification) {
    ev.stopPropagation();          // no dispares el click del <li>
    this.markAsRead(notification.id);  // bajar badge y quitar bg

    // borrar en backend y refrescar (o quitar de la lista en UI)
    this.notif.deleteNotification(notification.id).subscribe({
      next: () => {
        this.userNotifications.set(
          this.userNotifications().filter(n => n.id !== notification.id)
        );
      },
      error: (error) => console.error('Error deleting notifications', error)
    });
  }

}
