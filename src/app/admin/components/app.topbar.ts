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
import { AuthService } from '../../auth/services/auth.service';

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

                <button type="button" class="layout-topbar-action" (click)="exit()">
                    <i class="pi pi-sign-out"></i>
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
                                        @if (notification.lastReadBy) {
                                          <div class="text-xs italic">Leído por: {{ notification.lastReadBy.username }}</div>
                                        }
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
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
  items!: MenuItem[];

  /** número que se muestra en el badge */
  public notifications = computed(() => this.unreadIds().size);

  /** listado completo proveniente del backend */
  public userNotifications = signal<UserNotification[]>([]);

  /** listado decorado con flag __unread (UI) */
  public decoratedNotifications = computed(() => {
    const list = this.userNotifications();
    const unread = this.unreadIds();
    return list.map(n => ({ ...n, __unread: unread.has(n.id) }));
  });

  /** cache local opcional (se sobreescribe con lo del backend) */
  private readonly LS_UNREAD_IDS_KEY = 'topbar.unreadIds';

  /** set de IDs no leídos */
  public unreadIds = signal<Set<number>>(new Set<number>());

  private notif = inject(NotificationsService);
  private sub?: Subscription;
  private zone = inject(NgZone);
  private router = inject(Router);
  private authService = inject(AuthService);
  @ViewChild('op') op!: Popover;

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    // 1) cache local por latencia
    this.unreadIds.set(this.readUnreadIdsFromStorage());

    // 2) evento en vivo: refrescar desde backend
    this.sub = this.notif.onContactCreated<any>().subscribe(() => {
      this.zone.run(() => this.getNotifications());
    });

    // 3) carga inicial
    this.getNotifications();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onBellClick(event: Event) {
    this.op.toggle(event);
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  /** Trae lista y calcula/usa unreadIds según formato de respuesta */
  getNotifications() {
    this.notif.getNotifications().subscribe({
      next: (res: any) => {
        // Soportar: A) { list, unreadIds }  B) array plano
        const list: UserNotification[] = Array.isArray(res) ? res : (res?.list ?? []);
        this.userNotifications.set(list);

        let nextSet: Set<number>;
        if (!Array.isArray(res) && Array.isArray(res?.unreadIds)) {
          // A) backend ya manda unreadIds
          nextSet = new Set<number>(res.unreadIds);
        } else {
          // B) backend NO manda unreadIds → derivar en cliente
          // Regla: si existe flag read → !read; si no, “no leída” = sin lastReadBy y sin last_read_at
          const unreadIds = list
            .filter((n: any) => ('read' in n) ? !n.read : !(n.lastReadBy || n.last_read_at))
            .map(n => n.id);
          nextSet = new Set<number>(unreadIds);
        }

        this.unreadIds.set(nextSet);
        this.writeUnreadIdsToStorage(nextSet); // cache opcional
      },
      error: (error) => console.error('Error fetching notifications', error)
    });
  }

  isSuperAdmin() {
    return this.authService.isSuperAdmin();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  /** Marca como leída en UI + backend */
  public markAsRead(id: number) {
    console.log(this.authService.getId())
    const next = new Set(this.unreadIds());
    if (next.delete(id)) {
      this.unreadIds.set(next);
      this.writeUnreadIdsToStorage(next);
    }
    this.notif.markAsRead(id, this.authService.getId()).subscribe({
      next: () => {
        // refresco para ver lastReadBy/last_read_at
        this.getNotifications();
      },
      error: (e) => console.error('Error marking as read', e)
    });
  }

  /** Elimina (marca leída + borra en backend y quita de la lista) */
  public onDeleteClick(ev: Event, notification: UserNotification) {
    ev.stopPropagation();
    this.markAsRead(notification.id);

    this.notif.deleteNotification(notification.id).subscribe({
      next: () => {
        this.userNotifications.set(
          this.userNotifications().filter(n => n.id !== notification.id)
        );
      },
      error: (error) => console.error('Error deleting notifications', error)
    });
  }

  /** Click en una notificación: marcar leída, navegar y cerrar popover */
  onNotificationClick(notification: UserNotification) {
    this.markAsRead(notification.id);

    if (notification.type === 'contacto') {
      this.router.navigateByUrl('admin/contacto');
    } else if (notification.type === 'reserva') {
      this.router.navigateByUrl('admin/reserva');
    }

    this.op?.hide();
  }

  exit() {
    this.authService.logout();
  }

  /** ---------- utilidades de cache local ---------- */
  private readUnreadIdsFromStorage(): Set<number> {
    try {
      const raw = localStorage.getItem(this.LS_UNREAD_IDS_KEY);
      const arr = raw ? (JSON.parse(raw) as number[]) : [];
      return new Set(arr.filter(n => Number.isFinite(n)));
    } catch {
      return new Set<number>();
    }
  }

  private writeUnreadIdsToStorage(set: Set<number>): void {
    try {
      localStorage.setItem(this.LS_UNREAD_IDS_KEY, JSON.stringify([...set]));
    } catch {}
  }
}
