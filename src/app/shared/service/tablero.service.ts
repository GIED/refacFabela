import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TotalesGeneralesTablero } from "src/app/inicio/model/TotalesGeneralesTablero";
import { environment } from "src/environments/environment";
import { locator } from "../sesion/locator";

@Injectable({
    providedIn: 'root'
  })
  export class TableroService {
  
    constructor(private http: HttpClient) { }
  
    obtenerTotalesGeneralesTablero(){
      let url = environment.servicios.apiRefacFabela + locator.obtenerTotalesGeneralesTablero;
      return this.http.get<TotalesGeneralesTablero>(url);
    }
   
  
  
  }