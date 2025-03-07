import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { User } from '../../core/User';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private _url = environment.apiBase;

  constructor( private http: HttpClient ) { }

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${ this._url }/users`).pipe(delay(3000));
  }

}
