import { NgModule } from '@angular/core';


import { AlmacenRoutingModule } from './almacen-routing.module';
import { IngresoMercanciaComponent } from './ingreso-mercancia/ingreso-mercancia.component';
import { TraspasosComponent } from './traspasos/traspasos.component';
import { InventarioComponent } from './inventario/inventario.component';
import { EntregaDeMercanciaComponent } from './entrega-de-mercancia/entrega-de-mercancia.component';
import { StockMinimoComponent } from './stock-minimo/stock-minimo.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { CountryService } from '../demo/service/countryservice';


@NgModule({
  declarations: [
    IngresoMercanciaComponent,
    TraspasosComponent,
    InventarioComponent,
    EntregaDeMercanciaComponent,
    StockMinimoComponent
  ],
  imports: [
   
    AlmacenRoutingModule,
    PrimeModule
  ], 
  providers:[CountryService]
})
export class AlmacenModule { }
