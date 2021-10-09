import { NgModule } from '@angular/core';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrimeModule } from '../shared/prime/prime.module';

import { ClienteComponent } from './pages/cliente/cliente.component';
import { CreditosComponent } from './pages/creditos/creditos.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { TipoCambioComponent } from './pages/tipo-cambio/tipo-cambio.component';



@NgModule({
    
  declarations: [ClienteComponent, UsuarioComponent, ProveedorComponent, CreditosComponent, TipoCambioComponent ],
  imports: [
    AdministracionRoutingModule,   
    PrimeModule
  ]
})
export class AdministracionModule {

}
