import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  URI = environment.urlApiPlanes

  constructor(private http: HttpClient) { }

  // id_clinica, fecha_creacion
  validarPlanGratuito(id: string, fecha: string) {
    return this.http.get(`${this.URI}/validar/plan/usuario/${id}/fecha/${fecha}`);
  }

}
