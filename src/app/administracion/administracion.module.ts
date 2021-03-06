import {NgModule} from '@angular/core';
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
import { ValidaComprobanteComponent } from './pages/valida-comprobante/valida-comprobante.component';
import { MuestraComprobantePagoComponent } from './components/muestra-comprobante-pago/muestra-comprobante-pago.component';




@NgModule({
    
  declarations: [ClienteComponent, UsuarioComponent, ProveedorComponent, CreditosComponent, TipoCambioComponent, ValidaComprobanteComponent, MuestraComprobantePagoComponent],
  imports: [
    AdministracionRoutingModule,   
    PrimeModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    CajaModule,
    VentasycotizacionesModule
    
    
  ],
  exports:[
    CreditosComponent 
   
  ]
})
export class AdministracionModule {

}
