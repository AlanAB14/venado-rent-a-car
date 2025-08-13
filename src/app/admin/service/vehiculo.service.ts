import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleType } from '../../core/VehicleType';
import { VehicleMainFeatures } from '../../core/VehicleMainFeatures';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private _url = environment.apiBase;

  constructor( private http: HttpClient ) { }

  getCaracteristicasPrincipales(): Observable<VehicleMainFeatures[]> {
    return this.http.get<VehicleMainFeatures[]>(`${ this._url }/main-features`)
  }

  getTipoDeVehiculo(): Observable<VehicleType[]> {
    return this.http.get<VehicleType[]>(`${ this._url }/vehicle-types`)
  }
}
