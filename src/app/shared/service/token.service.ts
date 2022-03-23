import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles:Array<string> = [];

  constructor(private router:Router) { }


  public setToken(token : string){
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(){
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getRoles(){
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values =JSON.parse(payloadDecoded);
    const roles = values.roles;

    return roles;
  }

  
 

  public isLogged(): boolean{
    
   if (this.getToken() != null) {
     return true;
   }
   return false;
  }

  public getNameUser(){
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values =JSON.parse(payloadDecoded);
    const nameUser = values.nombreUsuario;

    return nameUser;
  }

  //obtener id del usuario
  public getIdUser(){
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values =JSON.parse(payloadDecoded);
    const idUser = values.nId;

    return idUser;
  }



  public logout(){
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
