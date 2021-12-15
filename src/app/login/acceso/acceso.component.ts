import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { Router } from '@angular/router';
import { LoginUsuario } from '../model/login-usuario';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss']
})
export class AccesoComponent  {

  isLogged = false;
  isLoginFail= false;
  loginUsuario:LoginUsuario;
  sUsuario: string;
  sPassword: string;
  errMsg:string;
  dark: boolean;
  checked: boolean;


  constructor( private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,){
    
  }

  onLogin(){
    this.loginUsuario = new LoginUsuario(this.sUsuario, this.sPassword);
    this.authService.login(this.loginUsuario).subscribe(data =>{
      this.tokenService.setToken(data.token);
      this.router.navigate(['/inicio'])
      this.messageService.add({ severity: 'success', summary: 'Acceso Correcto', detail: "Inicio de sesión correcto", life: 3000 });

    });
  }

}
