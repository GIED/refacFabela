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
    const roles = this.tokenService.getRoles();

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
      }
    })

   
    if (!this.tokenService.isLogged || expectedRol.indexOf(this.realRol) < 0) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}