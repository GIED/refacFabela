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
export class AccesoComponent{

  loginUsuario:LoginUsuario;
  sUsuario: string;
  sPassword: string;
  roles: string[]=[];
  dark: boolean;
  checked: boolean;
  errorLogin: string = '';
  cargando: boolean = false;
  currentYear: number = new Date().getFullYear();

  showPassword: boolean = false;


  constructor( private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,){
    
  }
 

  onLogin(){
    this.errorLogin = '';
    this.cargando = true;
    this.loginUsuario = new LoginUsuario(this.sUsuario, this.sPassword);
    this.authService.login(this.loginUsuario).subscribe(data =>{
      this.cargando = false;
      this.tokenService.setToken(data.token);
      this.router.navigate(['/inicio/inicio-general'])
      this.messageService.add({ severity: 'success', summary: 'Acceso Correcto', detail: "Inicio de sesión correcto", life: 3000 });

    },error =>{
      this.cargando = false;
      const mensaje = error?.error?.mensaje
                   || 'Usuario o contraseña incorrectos. Verifica tus datos e intenta nuevamente.';
      this.errorLogin = mensaje;
      this.messageService.add({ severity: 'error', summary: 'Acceso incorrecto', detail: mensaje, life: 6000 });
    });
  }

}
