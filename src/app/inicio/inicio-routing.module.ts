import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableroComponent } from './tablero/tablero.component';
import { InicioGeneralComponent } from './inicio-general/inicio-general.component';


const routes: Routes = [
  {
    path:'tablero',   component:TableroComponent,    
  },
  {
    path:'inicio-general',   component:InicioGeneralComponent,    
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule {

  
 }
