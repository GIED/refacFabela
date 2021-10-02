import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { CalendarModule } from 'primeng/calendar';
import { ClienteComponent } from './administracion/cliente/cliente.component';
import { Children } from 'preact/compat';




const routes: Routes = [
    {
     path:'administracion', component: AppMainComponent,
     loadChildren:() => import('./administracion/administracion.module').then(m => m.AdministracionModule)
     
   },
   
   {
     path:'**',
     redirectTo:'administracion'
   }
   
   
   
   
   ];
   
   @NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule]
   })
export class AppRoutingModule {
}
