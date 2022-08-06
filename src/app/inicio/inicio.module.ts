import { NgModule } from '@angular/core';
import { InicioRoutingModule } from './inicio-routing.module';
import { TableroComponent } from './tablero/tablero.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { InicioGeneralComponent } from './inicio-general/inicio-general.component';


@NgModule({
  declarations: [
    TableroComponent,
    InicioGeneralComponent
  ],
  imports: [
    PrimeModule,
    InicioRoutingModule
  ]
})
export class InicioModule { }
