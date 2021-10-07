import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas/ventas.component';
import { VentasPorPedidoComponent } from './ventas-por-pedido/ventas-por-pedido.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { ConsultaVentaComponent } from './consulta-venta/consulta-venta.component';
import { ConsultaCotizacionComponent } from './consulta-cotizacion/consulta-cotizacion.component';
import { CancelaVentaComponent } from './cancela-venta/cancela-venta.component';

const routes: Routes = [
  {
    path:'',
    children:[
    {
    path:'ventas',   component:VentasComponent,
    },
    {
      path:'ventas-por-pedido',   component:VentasPorPedidoComponent,
      },
      {
        path:'cotizaciones',   component:CotizacionesComponent,
        },
        {
          path:'consulta-venta',   component:ConsultaVentaComponent,
          },
          {
            path:'consulta-cotizacion',   component:ConsultaCotizacionComponent,
            },
            {
              path:'cancela-venta',   component:CancelaVentaComponent,
              }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasycotizacionesRoutingModule { }
