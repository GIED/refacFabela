import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TotalesGeneralesTablero } from "src/app/inicio/model/TotalesGeneralesTablero";
import { environment } from "src/environments/environment";
import { locator } from "../sesion/locator";
import { VentaMesAno } from "src/app/inicio/model/VentaMesAno";
import { VwVentaProductoAno } from "src/app/inicio/model/VwVentraProductoAno";

@Injectable({
    providedIn: 'root'
  })
  export class TableroService {
  
    constructor(private http: HttpClient) { }
  
    obtenerTotalesGeneralesTablero(){
      let url = environment.servicios.apiRefacFabela + locator.obtenerTotalesGeneralesTablero;
      return this.http.get<TotalesGeneralesTablero>(url);
    }
    obtenerVentasMesAno(ano:string){
      let url = environment.servicios.apiRefacFabela + locator.obtenerVentaMesAno+'ano='+ ano;
      return this.http.get<VentaMesAno[]>(url);
    }
    obtenerVentasProductoAno(ano:string){
      let url = environment.servicios.apiRefacFabela + locator.obtenerVentaProductoAno+'ano='+ ano;
      return this.http.get<VwVentaProductoAno[]>(url);
    }
  
  
  }