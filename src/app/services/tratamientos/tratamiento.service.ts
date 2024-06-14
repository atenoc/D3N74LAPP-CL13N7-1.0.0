import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from 'src/app/models/Tratamiento.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  URI = environment.urlApiTratamientos

  constructor(private http: HttpClient) { }

  createTratamiento(tratamiento: Tratamiento): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(`${this.URI}`, tratamiento);
  }

  getTratamientosByIdPaciente(id_paciente:string): Observable<Tratamiento[]>{
    return this.http.get<Tratamiento[]>(`${this.URI}/paciente/${id_paciente}`);
  }

  getTratamientById(id: string) {
    return this.http.get<Tratamiento>(`${this.URI}/${id}`);
  }

  updateTratamiento(id, tratamiento: Tratamiento): Observable<Tratamiento> {
    return this.http.patch<Tratamiento>(`${this.URI}/${id}`, tratamiento);
  }

  deleteTratamient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`);
  }
}
