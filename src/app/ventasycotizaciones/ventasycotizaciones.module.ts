import { NgModule } from '@angular/core';
import { PrimeModule } from '../shared/prime/prime.module';
import { VentasycotizacionesRoutingModule } from './ventasycotizaciones-routing.module';

import { CancelaVentaComponent } from './pages/cancela-venta/cancela-venta.component';
import { ConsultaCotizacionComponent } from './pages/consulta-cotizacion/consulta-cotizacion.component';
import { ConsultaVentaComponent } from './pages/consulta-venta/consulta-venta.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { VentasPorPedidoComponent } from './pages/ventas-por-pedido/ventas-por-pedido.component';
import { ProductosModule } from '../productos/productos.module';
import { DetalleClienteComponent } from './components/detalle-cliente/detalle-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormVentaComponent } from './components/form-venta/form-venta.component';
import { DetalleCotizacionComponent } from './components/detalle-cotizacion/detalle-cotizacion.component';
import { ProductosAlternativosVentaComponent } from './components/productos-alternativos-venta/productos-alternativos-venta.component';
import { VentaProductosDetalleComponent } from './components/venta-productos-detalle/venta-productos-detalle.component';
import { FormVentaPedidoComponent } from './components/form-venta-pedido/form-venta-pedido.component';
import { VentasPorInternetComponent } from './pages/ventas-por-internet/ventas-por-internet.component';
import { DescuentoVentaComponent } from './pages/descuento-venta/descuento-venta.component';
import { FormCompraInternetComponent } from './components/form-compra-internet/form-compra-internet.component';
import { PagoVentaInternetComponent } from './pages/pago-venta-internet/pago-venta-internet.component';
import { FormCargaComprobanteComponent } from './components/form-carga-comprobante/form-carga-comprobante.component';




@NgModule({
  declarations: [VentasComponent, VentasPorPedidoComponent, ConsultaVentaComponent,

    ConsultaCotizacionComponent, CancelaVentaComponent, DetalleClienteComponent, FormVentaComponent, DetalleCotizacionComponent, ProductosAlternativosVentaComponent, VentaProductosDetalleComponent, FormVentaPedidoComponent, VentasPorInternetComponent, FormCompraInternetComponent, PagoVentaInternetComponent, FormCargaComprobanteComponent, DescuentoVentaComponent],

  imports: [
    VentasycotizacionesRoutingModule,
    PrimeModule,
    ProductosModule,
    ReactiveFormsModule
  ],
  exports:[VentaProductosDetalleComponent, DescuentoVentaComponent, ProductosAlternativosVentaComponent]
})
export class VentasycotizacionesModule { }
