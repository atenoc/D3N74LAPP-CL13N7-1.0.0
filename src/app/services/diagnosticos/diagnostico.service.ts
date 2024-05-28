import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostico } from 'src/app/models/Diagnostico.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  URI = environment.urlApiDiagnosticos

  constructor(private http: HttpClient) { }

  createDiagnostico(diagnostico: Diagnostico): Observable<Diagnostico> {
    return this.http.post<Diagnostico>(`${this.URI}`, diagnostico);
  }

  getDiagnosticosByIpPaciente(id_paciente:string): Observable<Diagnostico[]>{
    return this.http.get<Diagnostico[]>(`${this.URI}/paciente/${id_paciente}`);
  }

  getDiagnosticoById(id: string) {
    return this.http.get<Diagnostico>(`${this.URI}/${id}`);
  }

  updatediagnostico(id, diagnostico: Diagnostico): Observable<Diagnostico> {
    return this.http.patch<Diagnostico>(`${this.URI}/${id}`, diagnostico);
  }

  deleteDiagnostico(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`);
  }
}
