import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CobrarComponent } from './cobrar/cobrar.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { CierreDeCajaComponent } from './cierre-de-caja/cierre-de-caja.component';
import { AbonosComponent } from './abonos/abonos.component';


@NgModule({
  declarations: [
    CobrarComponent,
    FacturacionComponent,
    CierreDeCajaComponent,
    AbonosComponent
  ],
  imports: [
    CommonModule,
    CajaRoutingModule
  ]
})
export class CajaModule { }
