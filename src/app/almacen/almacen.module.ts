import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PrimeModule } from '../shared/prime/prime.module';
import { AlmacenRoutingModule } from './almacen-routing.module';


import { EntregaDeMercanciaComponent } from './pages/entrega-de-mercancia/entrega-de-mercancia.component';
import { IngresoMercanciaComponent } from './pages/ingreso-mercancia/ingreso-mercancia.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { TraspasosComponent } from './pages/traspasos/traspasos.component';

import { CountryService } from '../demo/service/countryservice';
import { ProductService } from '../demo/service/productservice';
import { InputBusquedaComponent } from '../productos/components/input-busqueda/input-busqueda.component';
import { ProductosModule } from '../productos/productos.module';
import { VentasycotizacionesModule } from '../ventasycotizaciones/ventasycotizaciones.module';
import { VentaProductosDetalleEntregaComponent } from './components/venta-productos-detalle-entrega/venta-productos-detalle-entrega.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualizaProductoAlmacenComponent } from './components/actualiza-producto-almacen/actualiza-producto-almacen.component';
import { AjusteInventarioComponent } from './components/ajuste-inventario/ajuste-inventario.component';
import { RegistroProductoFacturaComponent } from './pages/registro-producto-factura/registro-producto-factura.component';
import { FormRegistroProductoFacturaComponent } from './components/form-registro-producto-factura/form-registro-producto-factura.component';
import { FormProductoFacturaComponent } from './components/form-producto-factura/form-producto-factura.component';
import { FormIngresoProductoComponent } from './components/form-ingreso-producto/form-ingreso-producto.component';
import { InventarioUbicacionComponent } from './pages/inventario-ubicacion/inventario-ubicacion.component';
import { AutorizacionInventarioComponent } from './pages/autorizacion-inventario/autorizacion-inventario.component';




@NgModule({
  declarations: [
    IngresoMercanciaComponent,
    TraspasosComponent,
    InventarioComponent,
    EntregaDeMercanciaComponent,
    VentaProductosDetalleEntregaComponent,
    ActualizaProductoAlmacenComponent,
    AjusteInventarioComponent,
    RegistroProductoFacturaComponent,
    FormRegistroProductoFacturaComponent,
    FormProductoFacturaComponent,
    FormIngresoProductoComponent,
    InventarioUbicacionComponent,
    AutorizacionInventarioComponent
  ],
  imports: [
    AlmacenRoutingModule,
    PrimeModule,
    ProductosModule,
    VentasycotizacionesModule,
    ReactiveFormsModule,  
  
  ], 
  exports:[
   
  ],

  
  
  providers:[CountryService, ProductService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AlmacenModule { }
