import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProdGuardService implements CanActivate{

  realRol: string;

  constructor(private tokenService: TokenService,
              private router: Router  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    const expectedRol = route.data.expectedRol;

    if (this.tokenService.IsAdmin()) {
      this.realRol= 'admin';
    }else if (this.tokenService.isVenta()) {
      this.realRol= 'ventas';
    }else if (this.tokenService.isDistribuidor()) {
      this.realRol= 'distribuidor';
    }else if (this.tokenService.isAlmacen()) {
      this.realRol= 'almacen';
    }else if (this.tokenService.isCaja()) {
      this.realRol= 'caja';
    }
    if (!this.tokenService.isLogged() || expectedRol.indexOf(this.realRol) < 0) {
      this.router.navigate(['/inicio']);
      return false;
    }
    return true;
  }
}