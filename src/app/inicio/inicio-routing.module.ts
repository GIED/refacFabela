import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableroComponent } from './tablero/tablero.component';


const routes: Routes = [
  {
    path:'',
    children:[
    {
    path:'tablero',   component:TableroComponent,
    },
    
     
    ]
    
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule {

  
 }
