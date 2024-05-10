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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MaquinaClienteComponent } from './components/maquina-cliente/maquina-cliente.component';
import { FormMaquinaClienteComponent } from './components/form-maquina-cliente/form-maquina-cliente.component';
import { AdministracionModule } from '../administracion/administracion.module';
import { CotizacionClienteProductoComponent } from './components/cotizacion-cliente-producto/cotizacion-cliente-producto.component';
import { CotizacionProductoComponent } from './components/cotizacion-producto/cotizacion-producto.component';
import { CotizacionesClienteVigentesComponent } from './components/cotizaciones-cliente-vigentes/cotizaciones-cliente-vigentes.component';
import { FormActualizaVentaComponent } from './components/form-actualiza-venta/form-actualiza-venta.component';






@NgModule({
  declarations: [VentasComponent, VentasPorPedidoComponent, ConsultaVentaComponent,

    ConsultaCotizacionComponent, CancelaVentaComponent, DetalleClienteComponent, FormVentaComponent, DetalleCotizacionComponent, ProductosAlternativosVentaComponent, VentaProductosDetalleComponent, FormVentaPedidoComponent, VentasPorInternetComponent, FormCompraInternetComponent, PagoVentaInternetComponent, FormCargaComprobanteComponent, DescuentoVentaComponent, MaquinaClienteComponent, FormMaquinaClienteComponent, CotizacionClienteProductoComponent, CotizacionProductoComponent, CotizacionesClienteVigentesComponent, FormActualizaVentaComponent ],

  imports: [
    VentasycotizacionesRoutingModule,
    PrimeModule,
    FormsModule, 
    ProductosModule,
    ReactiveFormsModule,
    AdministracionModule,
    

    
    
  ],
  exports:[VentaProductosDetalleComponent, DescuentoVentaComponent, ProductosAlternativosVentaComponent]
})
export class VentasycotizacionesModule { }
