import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seguimiento } from 'src/app/models/Seguimiento.model';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  URI = environment.urlApiSeguimientos

  constructor(private http: HttpClient) { }

  createSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    seguimiento.id_usuario_creador = localStorage.getItem('_us')
    seguimiento.id_clinica = localStorage.getItem('_cli')
    seguimiento.fecha_creacion = DateUtil.getCurrentFormattedDate()
    return this.http.post<Seguimiento>(`${this.URI}`, seguimiento);
  }

  getSeguimientosByIdPaciente(id_paciente:string): Observable<Seguimiento[]>{
    return this.http.get<Seguimiento[]>(`${this.URI}/paciente/${id_paciente}`);
  }

  getSeguimiento(id: string) {
    return this.http.get<Seguimiento>(`${this.URI}/${id}`);
  }

  updateSeguimiento(id: string, seguimiento: Seguimiento): Observable<Seguimiento> {
    seguimiento.id_usuario_actualizo = localStorage.getItem('_us')
    seguimiento.id_clinica = localStorage.getItem('_cli')
    seguimiento.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Seguimiento>(`${this.URI}/${id}`, seguimiento);
  }

  deleteSeguimiento(id: string): Observable<void> {
    const params = new HttpParams()
      .set('id_usuario_elimino', localStorage.getItem('_us'))
      .set('id_clinica', localStorage.getItem('_cli'))
      .set('fecha_eliminacion', DateUtil.getCurrentFormattedDate())
    return this.http.delete<void>(`${this.URI}/${id}`, { params });
  }
}
