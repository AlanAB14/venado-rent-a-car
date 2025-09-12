import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleType } from '../../core/VehicleType';
import { VehicleMainFeatures } from '../../core/VehicleMainFeatures';
import { VehicleOtherFeature } from '../../core/VehicleOtherFeature';
import { toFormData } from '../../core/utils/formdata.util';
import { Vehicle } from '../../core/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private _url = environment.apiBase;

  constructor( private http: HttpClient ) { }

  getCaracteristicasPrincipales(): Observable<VehicleMainFeatures[]> {
    return this.http.get<VehicleMainFeatures[]>(`${ this._url }/main-features`)
  }

  getCaracteristicasSecundarias(): Observable<VehicleOtherFeature[]> {
    return this.http.get<VehicleOtherFeature[]>(`${ this._url }/other-features`)
  }

  getTipoDeVehiculo(): Observable<VehicleType[]> {
    return this.http.get<VehicleType[]>(`${ this._url }/vehicle-types`)
  }

  getVehiculos(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${ this._url }/cars`)
  }

  getVehiculo(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${ this._url }/cars/${ id }`)
  }

  setVehiculo(vehiculoData: any) {
    const fd = toFormData(vehiculoData, undefined, undefined, {
      repeatKeysFor: ['images', 'vehicle_type', 'other_features'],
      indices: false,
      booleansAsStrings: true
    });

    return this.http.post(`${ this._url }/cars`, fd)
  }

  patchVehiculo(vehiculoData: any, id: number) {
    const fd = toFormData(vehiculoData, undefined, undefined, {
      repeatKeysFor: ['images', 'vehicle_type', 'other_features'],
      indices: false,
      booleansAsStrings: true
    });

    return this.http.patch(`${ this._url }/cars/${ id }`, fd)
  }

  deleteVehiculo(id: number) {
    return this.http.delete(`${ this._url }/cars/${ id }`)
  }

  setCaracteristicaPrincipal(mainFeatures: VehicleMainFeatures) {
    return this.http.post(`${ this._url }/main-features`, mainFeatures)
  }

  setCaracteristicaSecundaria(otherFeatures: VehicleOtherFeature) {
    return this.http.post(`${ this._url }/other-features`, otherFeatures)
  }
}
