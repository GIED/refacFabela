import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CobrarComponent } from './cobrar/cobrar.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { CierreDeCajaComponent } from './cierre-de-caja/cierre-de-caja.component';
import { AbonosComponent } from './abonos/abonos.component';

const routes: Routes = [

  {
    path:'',
    children:[
    {
    path:'cobrar',   component:CobrarComponent,
    },
    {
      path:'facturacion',   component:FacturacionComponent,
      },
      {
        path:'cierre-de-caja',   component:CierreDeCajaComponent,
        },

        {
          path:'abonos',   component:AbonosComponent,
          },
        
       
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
