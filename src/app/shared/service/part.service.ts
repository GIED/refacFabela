import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartResponse } from 'src/app/productos/model/PartResponse ';
import { CtpConstantes } from '../utils/UserPart.enum';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

@Injectable({
  providedIn: 'root'
})
export class PartService {

   

  constructor(private http :HttpClient) { }

  obtenerProductoCostex(NoParte:string, Cantidad:string){
      let url = environment.servicios.apiRefacFabela + locator.obtenerProductoCostex+ 'numeroParte='+NoParte + '&cantidad='+Cantidad;
      return this.http.get<PartResponse>(url);
    }
    
  }

