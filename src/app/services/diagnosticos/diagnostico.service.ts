import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostico } from 'src/app/models/Diagnostico.model';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  URI = environment.urlApiDiagnosticos

  constructor(private http: HttpClient) { }

  createDiagnostico(diagnostico: Diagnostico): Observable<Diagnostico> {
    diagnostico.id_usuario_creador = localStorage.getItem('_us')
    diagnostico.id_clinica = localStorage.getItem('_cli')
    diagnostico.fecha_creacion = DateUtil.getCurrentFormattedDate()
    return this.http.post<Diagnostico>(`${this.URI}`, diagnostico);
  }

  getDiagnosticosByIpPaciente(id_paciente:string): Observable<Diagnostico[]>{
    return this.http.get<Diagnostico[]>(`${this.URI}/paciente/${id_paciente}`);
  }

  getDiagnosticoById(id: string) {
    return this.http.get<Diagnostico>(`${this.URI}/${id}`);
  }

  updateDiagnostico(id:string, diagnostico: Diagnostico): Observable<Diagnostico> {
    diagnostico.id_usuario_actualizo = localStorage.getItem('_us')
    diagnostico.id_clinica = localStorage.getItem('_cli')
    diagnostico.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Diagnostico>(`${this.URI}/${id}`, diagnostico);
  }

  deleteDiagnostico(id: string): Observable<void> {
    const params = new HttpParams()
      .set('id_usuario_elimino', localStorage.getItem('_us'))
      .set('id_clinica', localStorage.getItem('_cli'))
      .set('fecha_eliminacion', DateUtil.getCurrentFormattedDate())
    return this.http.delete<void>(`${this.URI}/${id}`, { params });
  }
}
