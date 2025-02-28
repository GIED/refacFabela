import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  constructor() { }

  obtenerFechaActualMexicoCentro(): Date {

    const fechaUTC = moment.utc(); // Obtiene la hora en UTC
    console.log(fechaUTC.tz('America/Mexico_City').toDate());
    return fechaUTC.tz('America/Mexico_City').toDate(); // Convierte a la zona horaria correcta y la devuelve como Date
  }
}