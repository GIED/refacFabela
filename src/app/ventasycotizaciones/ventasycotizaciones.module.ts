import { NgModule } from '@angular/core';


import { VentasycotizacionesRoutingModule } from './ventasycotizaciones-routing.module';
import { PrimeModule } from '../shared/prime/prime.module';
import { VentasComponent } from './ventas/ventas.component';
import { VentasPorPedidoComponent } from './ventas-por-pedido/ventas-por-pedido.component';

import { ConsultaVentaComponent } from './consulta-venta/consulta-venta.component';
import { ConsultaCotizacionComponent } from './consulta-cotizacion/consulta-cotizacion.component';
import { CancelaVentaComponent } from './cancela-venta/cancela-venta.component';


@NgModule({
  declarations: [VentasComponent, VentasPorPedidoComponent, ConsultaVentaComponent,ConsultaCotizacionComponent, CancelaVentaComponent],
  imports: [
  
    VentasycotizacionesRoutingModule,
    PrimeModule
  ]
})
export class VentasycotizacionesModule { }
