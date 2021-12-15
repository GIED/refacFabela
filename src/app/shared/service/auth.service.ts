import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { LoginUsuario } from 'src/app/login/model/login-usuario';
import { JwtDto } from 'src/app/login/model/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
constructor(private http: HttpClient) { }

public login (loginUsuario: LoginUsuario){
  return this.http.post<JwtDto>(environment.servicios.apiRefacFabela+locator.login, loginUsuario);
}
public refresh (jwtDto: JwtDto){
  return this.http.post<JwtDto>(environment.servicios.apiRefacFabela+locator.refresh, jwtDto);
}

}
