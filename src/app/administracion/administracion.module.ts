import { NgModule } from '@angular/core';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrimeModule } from '../shared/prime/prime.module';

import { ClienteComponent } from './pages/cliente/cliente.component';
import { CreditosComponent } from './pages/creditos/creditos.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { TipoCambioComponent } from './pages/tipo-cambio/tipo-cambio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CajaModule } from '../caja/caja.module';
import { VentasycotizacionesModule } from '../ventasycotizaciones/ventasycotizaciones.module';




@NgModule({
    
  declarations: [ClienteComponent, UsuarioComponent, ProveedorComponent, CreditosComponent, TipoCambioComponent],
  imports: [
    AdministracionRoutingModule,   
    PrimeModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    CajaModule,
    ReactiveFormsModule,
    CajaModule,
    VentasycotizacionesModule
    
    
  ],
  exports:[
    CreditosComponent 
   
  ]
})
export class AdministracionModule {

}
