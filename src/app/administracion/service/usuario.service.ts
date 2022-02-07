import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';
import { NuevoUsuario } from '../model/nuevo-usuario';
import { TcUsuario } from '../model/TcUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuarios() {
    let url = environment.servicios.apiRefacFabela + locator.obtenerUsuarios;
    return this.http.get<TcUsuario[]>(url);
  }

  public nuevo (nuevoUsuario: NuevoUsuario){
    return this.http.post<any>(environment.servicios.apiRefacFabela+locator.nuevoUsuario, nuevoUsuario);
  }

  getUsuariosId(id:number) {
    let url = environment.servicios.apiRefacFabela + locator.obtenerUsuariosId+'id='+id;
    return this.http.get<TcUsuario>(url);
  }

}
