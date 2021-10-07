import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  constructor(private http: HttpClient) { }

    getCountries() {
    return this.http.get<any>('../data/bodegas.json')
      .toPromise()
      .then(res => res.data as any[])
      .then(data => data);
    }
}
