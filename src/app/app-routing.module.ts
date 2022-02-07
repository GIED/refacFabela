import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AccesoComponent } from './login/acceso/acceso.component';
import { LoginGuard } from './shared/guards/login.guard';
import { ProdGuardService } from './shared/guards/prod-guard.service';




const routes: Routes = [
    {
     path:'administracion', component: AppMainComponent,  canActivate:[ProdGuardService], data: {expectedRol: ['admin']},
     loadChildren:() => import('./administracion/administracion.module').then(m => m.AdministracionModule),
     
   },
   {
    path:'ventasycotizaciones', component: AppMainComponent,
    loadChildren:() => import('./ventasycotizaciones/ventasycotizaciones.module').then(m => m.VentasycotizacionesModule),
   
  },
  {
    path:'almacen', component: AppMainComponent,
    loadChildren:() => import('./almacen/almacen.module').then(m => m.AlmacenModule),
   
  },
  {
    path:'productos', component: AppMainComponent,
    loadChildren:() => import('./productos/productos.module').then(m => m.ProductosModule),
     
  },
  {
    path:'caja', component: AppMainComponent,
    loadChildren:() => import('./caja/caja.module').then(m => m.CajaModule),
    
  },
  {
    path:'reportes', component: AppMainComponent,
    loadChildren:() => import('./reportes/reportes.module').then(m => m.ReportesModule),
    
  },
  {
    path:'inicio', component:AppMainComponent,
    loadChildren:() => import('./inicio/inicio.module').then(m => m.InicioModule),
    
  },
  {
    path:'login', component:AccesoComponent, canActivate:[LoginGuard],
    loadChildren:() => import('./login/login.module').then(m => m.LoginModule),
    
  },
   {
     path:'**',
     redirectTo:''
   },
  
   ];
   
   @NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule]
   })
export class AppRoutingModule {
}
