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
import { AdminCajaComponent } from './pages/admin-caja/admin-caja.component';
import { FormClienteComponent } from './components/form-cliente/form-cliente.component';




@NgModule({
    
  declarations: [ClienteComponent, UsuarioComponent, ProveedorComponent, CreditosComponent, TipoCambioComponent, ValidaComprobanteComponent, MuestraComprobantePagoComponent, AdminCajaComponent, FormClienteComponent],
  imports: [
    AdministracionRoutingModule,   
    PrimeModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    CajaModule,
    
    
    
  ],
  exports:[
    CreditosComponent, FormClienteComponent,ClienteComponent
   
  ]
})
export class AdministracionModule {

}
