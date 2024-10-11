import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from 'src/app/models/Tratamiento.model';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  URI = environment.urlApiTratamientos

  constructor(private http: HttpClient) { }

  createTratamiento(tratamiento: Tratamiento): Observable<Tratamiento> {
    tratamiento.id_usuario_creador = localStorage.getItem('_us')
    tratamiento.id_clinica = localStorage.getItem('_cli')
    tratamiento.fecha_creacion = DateUtil.getCurrentFormattedDate()
    return this.http.post<Tratamiento>(`${this.URI}`, tratamiento);
  }

  getTratamientosByIdPaciente(id_paciente:string): Observable<Tratamiento[]>{
    return this.http.get<Tratamiento[]>(`${this.URI}/paciente/${id_paciente}`);
  }

  getTratamientById(id: string) {
    return this.http.get<Tratamiento>(`${this.URI}/${id}`);
  }

  updateTratamiento(id: string, tratamiento: Tratamiento): Observable<Tratamiento> {
    tratamiento.id_usuario_actualizo = localStorage.getItem('_us')
    tratamiento.id_clinica = localStorage.getItem('_cli')
    tratamiento.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Tratamiento>(`${this.URI}/${id}`, tratamiento);
  }

  deleteTratamient(id: string): Observable<void> {
    const params = new HttpParams()
      .set('id_usuario_elimino', localStorage.getItem('_us'))
      .set('id_clinica', localStorage.getItem('_cli'))
      .set('fecha_eliminacion', DateUtil.getCurrentFormattedDate())
    return this.http.delete<void>(`${this.URI}/${id}`, { params });
  }
}
