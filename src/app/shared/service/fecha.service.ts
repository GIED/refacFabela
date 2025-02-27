import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  constructor() { }

  obtenerFechaActualMexicoCentro(): Date {

    const fecha = moment().tz('America/Mexico_City');
console.log('Offset:', fecha.format('Z')); // Debería ser "-06:00" o "-05:00" en horario de verano
console.log('Fecha en México:', fecha.format('YYYY-MM-DD HH:mm:ss'));

const otra = moment().tz('America/Mexico_City').utc().format(); // Formato ISO en UTC
console.log('Fecha enviada al backend:', otra);

    const fechaUTC = moment.utc(); // Obtiene la hora en UTC
    return fechaUTC.tz('America/Mexico_City').toDate(); // Convierte a la zona horaria correcta y la devuelve como Date
  }
}