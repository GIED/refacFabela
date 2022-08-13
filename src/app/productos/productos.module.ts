
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
    VentaStockCeroComponent    
    
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PrimeModule,
    ReactiveFormsModule, 
    FormsModule, 
    NgxSpinnerModule,
  
  
  
    
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
    VentaStockCeroComponent

  ]
})
export class ProductosModule { }
