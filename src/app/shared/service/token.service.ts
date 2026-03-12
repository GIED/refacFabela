import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor(private router: Router) { }

  public setToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getRoles() {
    if (!this.isLogged()) {
      this.logout();
      return null;
    }
    try {
      const token = this.getToken();
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      return values.roles;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  public isLogged(): boolean {
    return this.getToken() != null;
  }

  public getNameUser() {
    if (!this.isLogged()) {
      this.logout();
      return null;
    }
    try {
      const token = this.getToken();
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      return values.nombreUsuario;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  // obtener id del usuario
  public getIdUser() {
    if (!this.isLogged()) {
      this.logout();
      return null;
    }
    try {
      const token = this.getToken();
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      return values.nId;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  public logout() {
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }

}
