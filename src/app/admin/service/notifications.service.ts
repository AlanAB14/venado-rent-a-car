import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socket!: Socket;

  constructor(private injector: EnvironmentInjector) {
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
}
