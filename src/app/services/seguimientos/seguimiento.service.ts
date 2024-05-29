import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seguimiento } from 'src/app/models/Seguimiento.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  URI = environment.urlApiSeguimientos

  constructor(private http: HttpClient) { }

  createSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(`${this.URI}`, seguimiento);
  }

  getSeguimientosByIdPaciente(id_paciente:string): Observable<Seguimiento[]>{
    return this.http.get<Seguimiento[]>(`${this.URI}/paciente/${id_paciente}`);
  }

  getSeguimiento(id: string) {
    return this.http.get<Seguimiento>(`${this.URI}/${id}`);
  }

  updateSeguimiento(id, seguimiento: Seguimiento): Observable<Seguimiento> {
    return this.http.patch<Seguimiento>(`${this.URI}/${id}`, seguimiento);
  }

  deleteSeguimiento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`);
  }
}
