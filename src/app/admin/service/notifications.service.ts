import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { EnvironmentInjector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserNotification } from '../../core/UserNotification';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socket!: Socket;
  private _url = environment.apiBase;

  constructor(private injector: EnvironmentInjector,
    private http: HttpClient
  ) {
    // Usa tu API base (ej: environment.apiUrl)
    const apiUrl = environment.api; // reemplazar por tu backend
    this.socket = io(`${apiUrl}/notifications`, {
      transports: ['websocket'], // evita long-polling si querés
      autoConnect: true,
      // Si usás auth JWT:
      // auth: { token: localStorage.getItem('access_token') }
    });
  }

  onContactCreated<T = any>(): Observable<T> {
    return fromEvent<T>(this.socket, 'contact:created');
  }

  getNotifications() {
    return this.http.get<{
      list: UserNotification[],
      unreadIds: number[],
      unreadCount: number
    }>(`${ this._url }/user-notifications`);
  }

  markAsRead(id: number, userId: number) {
    return this.http.post(`${ this._url }/user-notifications/${id}/read`, { userId });
  }

  deleteNotification(id: number) {
    return this.http.delete<any>(`${ this._url }/user-notifications/${id}`);
  }


}
