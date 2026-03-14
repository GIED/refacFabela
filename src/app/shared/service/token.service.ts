import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor(private router: Router) { }

  /**
   * Decodifica base64url (formato JWT) a string.
   * atob() solo soporta base64 estándar; los JWT usan base64url
   * que reemplaza + por - y / por _ y omite el padding =.
   */
  private decodeBase64Url(str: string): string {
    // Reemplazar caracteres base64url → base64 estándar
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Agregar padding si es necesario
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    return atob(base64);
  }

  /**
   * Parsea el payload del JWT y devuelve el objeto de claims.
   * Retorna null si no hay token o si el parseo falla.
   */
  private getTokenPayload(): any {
    if (!this.isLogged()) {
      return null;
    }
    try {
      const token = this.getToken();
      const payload = token.split('.')[1];
      const payloadDecoded = this.decodeBase64Url(payload);
      return JSON.parse(payloadDecoded);
    } catch (e) {
      console.error('Error al parsear token JWT:', e);
      return null;
    }
  }

  public setToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getRoles(): string[] {
    const payload = this.getTokenPayload();
    if (!payload || !payload.roles) {
      return [];
    }
    return payload.roles;
  }

  public isLogged(): boolean {
    return this.getToken() != null;
  }

  public getNameUser(): string {
    const payload = this.getTokenPayload();
    return payload ? payload.nombreUsuario : null;
  }

  public getIdUser(): number {
    const payload = this.getTokenPayload();
    return payload ? payload.nId : null;
  }

  public getIdCliente(): number {
    const payload = this.getTokenPayload();
    return payload ? payload.nIdCliente : null;
  }

  public logout() {
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }

}
