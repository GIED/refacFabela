
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from './productos-routing.module';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto.component';
import { HistorialProductoComponent } from './pages/historial-producto/historial-producto.component';
import { AlternativosProductoComponent } from './pages/alternativos-producto/alternativos-producto.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { ModalProductoComponent } from './components/modal-producto/modal-producto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HistoriaPrecioProductoComponent } from './components/historia-precio-producto/historia-precio-producto.component';
import { InputBusquedaComponent } from './components/input-busqueda/input-busqueda.component';
import { ModalProductosBodegaComponent } from './components/modal-productos-bodega/modal-productos-bodega.component';
import { ModalProductosAlternativosComponent } from './components/modal-productos-alternativos/modal-productos-alternativos.component';
import { ConsultaCotizacionComponent } from '../ventasycotizaciones/components/consulta-cotizacion/consulta-cotizacion.component';





@NgModule({
  declarations: [
    RegistroProductoComponent, 
    HistorialProductoComponent,
    AlternativosProductoComponent, 
    ModalProductoComponent, 
    HistoriaPrecioProductoComponent, 
    InputBusquedaComponent, 
    ModalProductosBodegaComponent,
    ModalProductosAlternativosComponent,
    ConsultaCotizacionComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PrimeModule,
    ReactiveFormsModule,  
    
  ],
  exports:[
    ModalProductoComponent,
    InputBusquedaComponent,
    ModalProductosBodegaComponent   
  ]
})
export class ProductosModule { }
