import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CobrarComponent } from './pages/cobrar/cobrar.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { CierreDeCajaComponent } from './pages/cierre-de-caja/cierre-de-caja.component';
import { AbonosComponent } from './pages/abonos/abonos.component';
import { GastosCajaComponent } from './pages/gastos-caja/gastos-caja.component';

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
          {
            path:'gastos-caja',   component:GastosCajaComponent,
            },
        
       
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
