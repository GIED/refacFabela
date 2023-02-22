import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TotalesGeneralesTablero } from "src/app/inicio/model/TotalesGeneralesTablero";
import { environment } from "src/environments/environment";
import { locator } from "../sesion/locator";
import { VentaMesAno } from "src/app/inicio/model/VentaMesAno";
import { VwVentaProductoAno } from "src/app/inicio/model/VwVentraProductoAno";
import { VwVentasAnoVendedor } from "src/app/inicio/model/VwVentasAnoVendedor";
import { VwVentasAnoMesVendedor } from "src/app/inicio/model/VwVentasAnoMesVendedor";

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

    obtenerVentasAnoVendedor(ano:string){
      let url = environment.servicios.apiRefacFabela + locator.obtenerVentasAnoVendedor+'ano='+ ano;
      return this.http.get<VwVentasAnoVendedor[]>(url);
    }
    obtenerVentasAnoMesVendedor(ano:string, id:number){
      let url = environment.servicios.apiRefacFabela + locator.obtenerVentasAnoMesVendedor+'ano='+ ano+'&id='+id;
      return this.http.get<VwVentasAnoMesVendedor[]>(url);
    }
  
  
  }