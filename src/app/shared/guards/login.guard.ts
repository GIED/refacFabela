import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthSessionService } from '../service/auth-session.service';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private tokenService: TokenService,
    private authSessionService: AuthSessionService,
    private router: Router  ) { }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.tokenService.hasToken()) {
      return of(true);
    }

    return this.authSessionService.ensureValidSession().pipe(
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          return true;
        }

        const roles = this.tokenService.getRoles();
        if (roles.indexOf('ROLE_REVENDEDOR') >= 0) {
          this.router.navigate(['/ventasycotizaciones/revendedor']);
        } else {
          this.router.navigate(['/inicio']);
        }
        return false;
      })
    );
  }
  
}
