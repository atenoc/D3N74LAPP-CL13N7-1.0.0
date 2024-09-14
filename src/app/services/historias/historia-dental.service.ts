import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Historia } from 'src/app/models/Historia.model';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HistoriaDentalService {

  URI = environment.urlApiHistorias

  constructor(private http: HttpClient) { }

  createHistoria(historia: any): Observable<Historia> {
    historia.id_usuario_creador = localStorage.getItem('_us')
    historia.id_clinica = localStorage.getItem('_cli')
    historia.fecha_creacion = DateUtil.getCurrentFormattedDate()
    return this.http.post<Historia>(`${this.URI}`, historia);
  }

  getHistoriaByIdPaciente(id: string) {
    return this.http.get<Historia>(`${this.URI}/paciente/${id}`);
  }

  updateHistoria(id:string, historia: any) {
    historia.id_usuario_actualizo = localStorage.getItem('_us')
    historia.id_clinica = localStorage.getItem('_cli')
    historia.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Historia>(`${this.URI}/${id}`, historia);
  }
}
