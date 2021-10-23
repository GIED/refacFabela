import { NgModule } from '@angular/core';
import { PrimeModule } from '../shared/prime/prime.module';
import { VentasycotizacionesRoutingModule } from './ventasycotizaciones-routing.module';

import { CancelaVentaComponent } from './pages/cancela-venta/cancela-venta.component';
import { ConsultaCotizacionComponent } from './pages/consulta-cotizacion/consulta-cotizacion.component';
import { ConsultaVentaComponent } from './pages/consulta-venta/consulta-venta.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { VentasPorPedidoComponent } from './pages/ventas-por-pedido/ventas-por-pedido.component';
import { ModalProductoComponent } from '../productos/components/modal-producto/modal-producto.component';
import { ProductosModule } from '../productos/productos.module';



@NgModule({
  declarations: [VentasComponent, VentasPorPedidoComponent, ConsultaVentaComponent,ConsultaCotizacionComponent, CancelaVentaComponent],
  imports: [
    VentasycotizacionesRoutingModule,
    PrimeModule,
    ProductosModule
  ]
})
export class VentasycotizacionesModule { }