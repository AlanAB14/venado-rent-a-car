import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../../core/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private _url = environment.apiBase;

  constructor( private http: HttpClient ) { }

  getReservas(): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(`${ this._url }/reservations`)
  }

  deleteReserva(id: number) {
    return this.http.delete(`${ this._url }/reservations/${ id }`)
  }
}
