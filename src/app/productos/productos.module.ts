
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from './productos-routing.module';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto.component';
import { HistorialProductoComponent } from './pages/historial-producto/historial-producto.component';
import { AlternativosProductoComponent } from './pages/alternativos-producto/alternativos-producto.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { ModalProductoComponent } from './components/modal-producto/modal-producto.component';
import { HistoriaPrecioProductoComponent } from './components/historia-precio-producto/historia-precio-producto.component';
import { InputBusquedaComponent } from './components/input-busqueda/input-busqueda.component';
import { ModalProductosAlternativosComponent } from './components/modal-productos-alternativos/modal-productos-alternativos.component';
import { RegistroPedidosComponent } from './pages/administracion-pedidos/registro-pedidos.component';
import { PedidoProductosComponent } from './components/pedido-productos/pedido-productos.component';
import { AltaPedidosComponent } from './components/alta-pedidos/alta-pedidos.component';
import { ModalProductosBodegaInternoComponent } from './components/modal-productos-bodega-interno/modal-productos-bodega-interno.component';
import { ModalProductoBodegaExternoComponent } from './components/modal-producto-bodega-externo/modal-producto-bodega-externo.component';
import { ModalProductosBodegaComponent } from './components/modal-productos-bodega/modal-productos-bodega.component';
import { VentaStockCeroComponent } from './pages/venta-stock-cero/venta-stock-cero.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HistorialStockProductoComponent } from './components/historial-stock-producto/historial-stock-producto.component';
import { ProductosCanceladosComponent } from './components/productos-cancelados/productos-cancelados.component';
import { ComprasProductoComponent } from './pages/compras-producto/compras-producto.component';
import { FechaRangoComponent } from './components/fecha-rango/fecha-rango.component';
import { CarritoPedidoComponent } from './components/carrito-pedido/carrito-pedido.component';
import { FormConsultaCostexComponent } from './components/form-consulta-costex/form-consulta-costex.component';
import { FormProductoComponent } from './components/form-producto/form-producto.component';






@NgModule({
  declarations: [
    RegistroProductoComponent, 
    HistorialProductoComponent,
    AlternativosProductoComponent, 
    ModalProductoComponent, 
    HistoriaPrecioProductoComponent, 
    InputBusquedaComponent, 
    ModalProductosAlternativosComponent,
    RegistroPedidosComponent,
    PedidoProductosComponent,
    AltaPedidosComponent,
    ModalProductosBodegaInternoComponent,
    ModalProductoBodegaExternoComponent,
    ModalProductosBodegaComponent,
    VentaStockCeroComponent,
    HistorialStockProductoComponent,
    ProductosCanceladosComponent,
    ComprasProductoComponent,
    FechaRangoComponent,
    CarritoPedidoComponent,
    FormConsultaCostexComponent,
    FormProductoComponent,
    
    
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PrimeModule,
    ReactiveFormsModule, 
    FormsModule, 
    NgxSpinnerModule
    
  
  
  
    
  ],
  exports:[
    RegistroProductoComponent, 
    HistorialProductoComponent,
    AlternativosProductoComponent, 
    ModalProductoComponent, 
    HistoriaPrecioProductoComponent, 
    InputBusquedaComponent, 
    ModalProductosBodegaInternoComponent,
    ModalProductoBodegaExternoComponent,
    ModalProductosBodegaComponent,
    ModalProductosAlternativosComponent,
    RegistroPedidosComponent,
    PedidoProductosComponent,
    AltaPedidosComponent,
    VentaStockCeroComponent,
    ComprasProductoComponent,
   FormConsultaCostexComponent,
    ModalProductoComponent,
    FormProductoComponent

  ]
})
export class ProductosModule { }
