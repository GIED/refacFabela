import { NgModule } from '@angular/core';
import { InicioRoutingModule } from './inicio-routing.module';
import { TableroComponent } from './tablero/tablero.component';
import { PrimeModule } from '../shared/prime/prime.module';


@NgModule({
  declarations: [
    TableroComponent
  ],
  imports: [
    PrimeModule,
    InicioRoutingModule
  ]
})
export class InicioModule { }
