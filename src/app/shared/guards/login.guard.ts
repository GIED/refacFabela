import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private tokenService: TokenService,
    private router: Router  ) { }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.hasToken() && !this.tokenService.isLogged()) {
      this.tokenService.logout();
      return true;
    }

    if (this.tokenService.isLogged()) {
      const roles = this.tokenService.getRoles();
      if (roles.indexOf('ROLE_REVENDEDOR') >= 0) {
        this.router.navigate(['/ventasycotizaciones/revendedor']);
      } else {
        this.router.navigate(['/inicio']);
      }
      return false;
    }
    return true;
  }
  
}
