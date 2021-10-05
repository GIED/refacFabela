import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { AccesoComponent } from './acceso/acceso.component';
import { PrimeModule } from '../shared/prime/prime.module';


@NgModule({
  declarations: [
    AccesoComponent
  ],
  imports: [
    PrimeModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
