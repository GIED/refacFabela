import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
  export class SumarDiaService {
    sumarUnDia(fecha: Date): Date {
      const nuevaFecha = new Date(fecha);
      fecha.setDate(fecha.getDate() + 1);
     
      return fecha;
    }
}
