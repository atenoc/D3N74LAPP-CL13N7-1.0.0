import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Centro } from '../models/Centro.model';

@Injectable({
  providedIn: 'root'
})
export class CentroService {

  URI = 'http://localhost:4000/api/centros';

  constructor(private http: HttpClient, private router:Router) { }

  createCentro(centro) {
    return this.http.post<any>(this.URI, centro)
  }

  getCentros() {
    return this.http.get<Centro[]>(this.URI);
  }

  getCentro(id: string) {
    return this.http.get<Centro>(`${this.URI}/${id}`);
  }

  deleteCentro(id: string) {
    return this.http.delete(`${this.URI}/${id}`);
  }

  updateCentro(id: string, nombre: string, telefono: string, correo:string, direccion:string) {
    return this.http.patch(`${this.URI}/${id}`, {nombre, telefono, correo, direccion});
  }
}
