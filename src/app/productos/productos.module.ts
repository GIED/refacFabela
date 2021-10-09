import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { RegistroProductoComponent } from './registro-producto/registro-producto.component';
import { HistorialProductoComponent } from './historial-producto/historial-producto.component';
import { AlternativosProductoComponent } from './alternativos-producto/alternativos-producto.component';
import { PrimeModule } from '../shared/prime/prime.module';


@NgModule({
  declarations: [RegistroProductoComponent, HistorialProductoComponent, AlternativosProductoComponent],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PrimeModule
  ]
})
export class ProductosModule { }
