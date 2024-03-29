import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AccesoComponent } from './login/acceso/acceso.component';
import { LoginGuard } from './shared/guards/login.guard';
import { ProdGuardService } from './shared/guards/prod-guard.service';




const routes: Routes = [
    {
     path:'administracion', component: AppMainComponent,  canActivate:[ProdGuardService], data: {expectedRol:['admin','caja','almacen']},
     loadChildren:() => import('./administracion/administracion.module').then(m => m.AdministracionModule),
     
   },
   {
    path:'ventasycotizaciones', component: AppMainComponent, canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas','caja']},
    loadChildren:() => import('./ventasycotizaciones/ventasycotizaciones.module').then(m => m.VentasycotizacionesModule),
   
  },
  {
    path:'almacen', component: AppMainComponent, canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas','almacen',]},
    loadChildren:() => import('./almacen/almacen.module').then(m => m.AlmacenModule),
   
  },
  {
    path:'productos', component: AppMainComponent, canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas','almacen']},
    loadChildren:() => import('./productos/productos.module').then(m => m.ProductosModule),
     
  },
  {
    path:'caja', component: AppMainComponent, canActivate:[ProdGuardService], data: {expectedRol: ['admin','caja']},
    loadChildren:() => import('./caja/caja.module').then(m => m.CajaModule),
    
  },
  {
    path:'reportes', component: AppMainComponent, canActivate:[ProdGuardService], data: {expectedRol:['admin','ventas','distribuidor','almacen','caja']},
    loadChildren:() => import('./reportes/reportes.module').then(m => m.ReportesModule),
    
  },
  {
    path:'inicio', component:AppMainComponent, canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas','distribuidor','almacen','caja']},
    loadChildren:() => import('./inicio/inicio.module').then(m => m.InicioModule),
    
  },
  {
    path:'login', component:AccesoComponent, canActivate:[LoginGuard],
    loadChildren:() => import('./login/login.module').then(m => m.LoginModule),
    
  },
   {
     path:'**',
     redirectTo:'login'
   },
  
   ];
   
   @NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule]
   })
export class AppRoutingModule {
}
