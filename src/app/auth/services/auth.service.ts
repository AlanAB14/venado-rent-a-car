import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Buffer } from 'buffer';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private tknStr = 'tkn_' + environment.app
  private _url = environment.apiBase;


  constructor( private _jwtHelperService: JwtHelperService, private _cookieService: CookieService, private _router: Router, private http: HttpClient ) { }


  isLoggedIn() {
    const token = this._cookieService.get(this.tknStr);
    if (!token)
      return false;
    else if (this._jwtHelperService.isTokenExpired(token)) {
      // this._router.navigate(['logout']);
      return false;
    }
    return true;
  }

  loginResponse() {
    if (this.isLoggedIn()) {
      this._router.navigate(['/admin']);
    }
    else {
      this._router.navigate(['/login']);
    }
  }

  loginUser(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    const body = {
      username,
      password
    }
    return this.http.post(`${ this._url }/auth/login`, body, httpOptions)
  }

  getToken(): string {
    return this._cookieService.get(this.tknStr);
  }

  getUser(): string {
    let finalData = this.getTokenJson();
    return finalData.newUser.user;
  }

  getSuperAdmin(): boolean {
    let finalData = this.getTokenJson();
    return finalData.newUser.super_admin;
  }

  getId(): number {
    let finalData = this.getTokenJson();
    return finalData.newUser.id;
  }

  logout() {
    this.deleteCookie();
    this._router.navigate(['login']);
  }

  deleteCookie() {
    this._cookieService.delete(this.tknStr)

    // const expiredDate = new Date();
    // expiredDate.setDate(expiredDate.getDate() - 1);
    // this._cookieService.set(this.tknStr, '', expiredDate, '/', '');
  }

  setCookie(token: string) {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);
    this._cookieService.set(this.tknStr, token, expiredDate)
  }

  private getTokenJson(): any {
    let token = this.getToken();
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const tokenObject = JSON.parse(jsonPayload);
    return tokenObject;
  }
}
