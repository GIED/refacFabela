import { NgModule } from '@angular/core';
import { AdministracionRoutingModule } from './administracion-routing.module';

import { ClienteComponent } from './cliente/cliente.component';
import { AppModule } from '../app.module';
import { PrimeModule } from '../shared/prime/prime.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { CreditosComponent } from './creditos/creditos.component';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';



@NgModule({
    
  declarations: [ClienteComponent, UsuarioComponent, ProveedorComponent, CreditosComponent, TipoCambioComponent ],
  imports: [
    AdministracionRoutingModule,   
    PrimeModule
    

    

  ],
    
 

})
export class AdministracionModule {

}
