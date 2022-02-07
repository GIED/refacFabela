import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CobrarComponent } from './pages/cobrar/cobrar.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { CierreDeCajaComponent } from './pages/cierre-de-caja/cierre-de-caja.component';
import { AbonosComponent } from './pages/abonos/abonos.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { DetalleAbonosCreditoComponent } from './components/detalle-abonos-credito/detalle-abonos-credito.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdministracionModule } from '../administracion/administracion.module';
import { FormAbonosComponent } from './components/form-abonos/form-abonos.component';



@NgModule({
  declarations: [
    CobrarComponent,
    FacturacionComponent,
    CierreDeCajaComponent,
    AbonosComponent,
    DetalleAbonosCreditoComponent,
    FormAbonosComponent
   
  ],
  imports: [
    CommonModule,
    PrimeModule,
    CajaRoutingModule,
    ReactiveFormsModule 
   
   
  ],
  exports:[
    DetalleAbonosCreditoComponent
  ]
})
export class CajaModule { }
