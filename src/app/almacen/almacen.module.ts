import { NgModule } from '@angular/core';


import { AlmacenRoutingModule } from './almacen-routing.module';
import { IngresoMercanciaComponent } from './ingreso-mercancia/ingreso-mercancia.component';
import { TraspasosComponent } from './traspasos/traspasos.component';
import { InventarioComponent } from './inventario/inventario.component';
import { EntregaDeMercanciaComponent } from './entrega-de-mercancia/entrega-de-mercancia.component';
import { StockMinimoComponent } from './stock-minimo/stock-minimo.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { CountryService } from '../demo/service/countryservice';
import { ProductService } from '../demo/service/productservice';
import { RegistroProductoComponent } from '../productos/registro-producto/registro-producto.component';


@NgModule({
  declarations: [
    IngresoMercanciaComponent,
    TraspasosComponent,
    InventarioComponent,
    EntregaDeMercanciaComponent,
 
   
  ],
  imports: [
   
    AlmacenRoutingModule,
    PrimeModule
  ], 
  providers:[CountryService, ProductService]
})
export class AlmacenModule { }
