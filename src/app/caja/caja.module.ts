import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CobrarComponent } from './pages/cobrar/cobrar.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { CierreDeCajaComponent } from './pages/cierre-de-caja/cierre-de-caja.component';
import { AbonosComponent } from './pages/abonos/abonos.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { DetalleAbonosCreditoComponent } from './components/detalle-abonos-credito/detalle-abonos-credito.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { FormAbonosComponent } from './components/form-abonos/form-abonos.component';
import { BalanceCajaComponent } from './components/balance-caja/balance-caja.component';
import { VentasycotizacionesRoutingModule } from '../ventasycotizaciones/ventasycotizaciones-routing.module';



@NgModule({
  declarations: [
    CobrarComponent,
    FacturacionComponent,
    CierreDeCajaComponent,
    AbonosComponent,
    DetalleAbonosCreditoComponent,
    FormAbonosComponent,
    BalanceCajaComponent
   
  ],
  imports: [
    CommonModule,
    PrimeModule,
    CajaRoutingModule,
    ReactiveFormsModule,
    VentasycotizacionesRoutingModule,
    
   
   
  ],
  exports:[
    DetalleAbonosCreditoComponent
  ]
})
export class CajaModule { }
