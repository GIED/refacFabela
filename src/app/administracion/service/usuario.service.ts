import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';
import { Usuarios } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuarios() {

    let url = environment.servicios.apiRefacFabela + locator.obtenerUsuarios;
    return this.http.get<Usuarios[]>(url);
  }
  guardaUsuario(usuario:Usuarios){
    let url = environment.servicios.apiRefacFabela+locator.guardarUsuario;
    return this.http.post<Usuarios>(url,usuario);
  }
}
