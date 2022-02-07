import { NgModule } from '@angular/core';
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



@NgModule({
  declarations: [
    IngresoMercanciaComponent,
    TraspasosComponent,
    InventarioComponent,
    EntregaDeMercanciaComponent,
    VentaProductosDetalleEntregaComponent
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

  
  
  providers:[CountryService, ProductService]
})
export class AlmacenModule { }
