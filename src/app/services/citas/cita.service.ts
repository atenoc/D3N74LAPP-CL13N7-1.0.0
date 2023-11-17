import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { Evento } from 'src/app/models/DetalleEvento.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  URI = environment.urlApiCitas

  private cita = new BehaviorSubject<Evento>(null);
  private citas = new BehaviorSubject<Evento[]>([]);
  private citaCreada:Evento
  private cita$: Subject<Evento>;

  constructor(private http: HttpClient) { }

  createCita(cita): Observable<Evento> {
    return this.http.post<Evento>(this.URI, cita).pipe(
      map(response => {
        this.citaCreada = response
        const newCitas = [this.citaCreada, ...this.citas.getValue()];
        this.citas.next(newCitas);
        this.cita.next(this.citaCreada);
        return this.citaCreada;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
