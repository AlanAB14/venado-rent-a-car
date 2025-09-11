import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm } from '../../core/ContactForm';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private _url = environment.apiBase;

  constructor( private http: HttpClient ) { }

  postContactForm(contact: ContactForm) {
    return this.http.post(`${ this._url }/contacts`, contact)
  }

  getContactForms(): Observable<ContactForm[]>{
    return this.http.get<ContactForm[]>(`${ this._url }/contacts`)
  }

  deleteContactForm(id: number) {
    return this.http.delete(`${ this._url }/contacts/${ id }`)
  }

}
