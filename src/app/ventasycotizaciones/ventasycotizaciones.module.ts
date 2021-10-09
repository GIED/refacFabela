import { NgModule } from '@angular/core';
import { PrimeModule } from '../shared/prime/prime.module';
import { VentasycotizacionesRoutingModule } from './ventasycotizaciones-routing.module';

import { CancelaVentaComponent } from './pages/cancela-venta/cancela-venta.component';
import { ConsultaCotizacionComponent } from './pages/consulta-cotizacion/consulta-cotizacion.component';
import { ConsultaVentaComponent } from './pages/consulta-venta/consulta-venta.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { VentasPorPedidoComponent } from './pages/ventas-por-pedido/ventas-por-pedido.component';



@NgModule({
  declarations: [VentasComponent, VentasPorPedidoComponent, ConsultaVentaComponent,ConsultaCotizacionComponent, CancelaVentaComponent],
  imports: [
    VentasycotizacionesRoutingModule,
    PrimeModule
  ]
})
export class VentasycotizacionesModule { }
