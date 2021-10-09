import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CobrarComponent } from './pages/cobrar/cobrar.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { CierreDeCajaComponent } from './pages/cierre-de-caja/cierre-de-caja.component';
import { AbonosComponent } from './pages/abonos/abonos.component';


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
