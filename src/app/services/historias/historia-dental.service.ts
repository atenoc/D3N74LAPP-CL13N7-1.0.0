import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Historia } from 'src/app/models/Historia.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HistoriaDentalService {

  URI = environment.urlApiHistorias

  constructor(private http: HttpClient) { }

  createHistoria(historia: Historia): Observable<Historia> {
    return this.http.post<Historia>(`${this.URI}`, historia);
  }

  getHistoriaByIdPaciente(id: string) {
    console.log("id paciente service: "+id)
    return this.http.get<Historia>(`${this.URI}/paciente/${id}`);
  }

  updateHistoria(id, historia: Historia): Observable<Historia> {
    return this.http.patch<Historia>(`${this.URI}/${id}`, historia);
  }
}
