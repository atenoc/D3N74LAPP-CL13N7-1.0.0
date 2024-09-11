import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auditoria } from 'src/app/models/Auditoria.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  URI = environment.urlApiAuditoria

  constructor(private http: HttpClient) { }

  getAccesoByIdUsuario(id: string) {
    return this.http.get<Auditoria>(`${this.URI}/acceso/${id}`);
  }
}
