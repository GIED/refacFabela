import { NgModule } from '@angular/core';
import { AdministracionRoutingModule } from './administracion-routing.module';

import { ClienteComponent } from './cliente/cliente.component';
import { AppModule } from '../app.module';
import { PrimeModule } from '../shared/prime/prime.module';


@NgModule({
    
  declarations: [ClienteComponent ],
  imports: [
    AdministracionRoutingModule,
   
    PrimeModule

    

  ],
    
 

})
export class AdministracionModule {

}
