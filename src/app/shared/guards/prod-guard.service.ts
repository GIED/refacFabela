import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthSessionService } from '../service/auth-session.service';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProdGuardService implements CanActivate{

  realRol: string;

  constructor(private tokenService: TokenService,
              private authSessionService: AuthSessionService,
              private router: Router  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authSessionService.ensureValidSession().pipe(
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          this.tokenService.logout();
          return false;
        }

        const expectedRol = route.data.expectedRol;
        const roles = this.tokenService.getRoles();

        if (!roles || roles.length === 0) {
          this.tokenService.logout();
          return false;
        }

        this.realRol = null;
        roles.forEach(rol =>{
          if (rol === 'ROLE_ADMIN') {
            this.realRol= 'admin';
          }else if (rol === 'ROLE_VENTA') {
            this.realRol= 'ventas';
          }else if (rol === 'ROLE_DISTRIBUIDOR') {
            this.realRol= 'distribuidor';
          }else if (rol === 'ROLE_ALMACEN') {
            this.realRol= 'almacen';
          }else if (rol === 'ROLE_CAJA') {
            this.realRol= 'caja';
          }else if (rol === 'ROLE_REVENDEDOR') {
            this.realRol= 'revendedor';
          }
        });

        if (!this.realRol || expectedRol.indexOf(this.realRol) < 0) {
          this.router.navigate(['/login']);
          return false;
        }

        return true;
      })
    );
  }
}