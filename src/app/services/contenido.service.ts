import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

  URI = 'http://localhost:4000/api/seguridad';

  constructor(private http: HttpClient, private router:Router) { }

  getContenido(){
    return this.http.get(this.URI + '/restringido')
  }
}
