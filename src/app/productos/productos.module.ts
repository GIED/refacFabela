import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto.component';
import { HistorialProductoComponent } from './pages/historial-producto/historial-producto.component';
import { AlternativosProductoComponent } from './pages/alternativos-producto/alternativos-producto.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { ModalProductoComponent } from './components/modal-producto/modal-producto.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RegistroProductoComponent, HistorialProductoComponent, AlternativosProductoComponent, ModalProductoComponent],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PrimeModule,
    ReactiveFormsModule
  ],
  exports:[
    ModalProductoComponent
  ]
})
export class ProductosModule { }
