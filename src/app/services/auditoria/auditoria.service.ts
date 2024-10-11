import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Acceso } from 'src/app/models/Acceso.model';
import { Auditoria, AuditoriaPaginados } from 'src/app/models/Auditoria.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  URI = environment.urlApiAuditoria

  constructor(private http: HttpClient) { }

  getAccesoByIdUsuario(id: string) {
    return this.http.get<Acceso>(`${this.URI}/acceso/${id}`);
  }

  getBitacoraByIdClinica(id_clinica: string) {
    return this.http.get<Auditoria[]>(`${this.URI}/bitacora/${id_clinica}`);
  }

  // get Usuarios Paginados por id_clinica
  getBitacoraByIdClinicaPaginado(
    id_clinica:string,
    page: number,
    size: number,
    orderBy: string,
    way: string
  ): Observable<AuditoriaPaginados> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('orderBy', String(orderBy))
      .set('way', String(way));
  
    return this.http.get<AuditoriaPaginados>(`${this.URI}/bitacora/${id_clinica}`, { params });
  }
}
