import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { Paciente } from 'src/app/models/Paciente.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  URI = environment.urlApiPacientes

  private paciente = new BehaviorSubject<Paciente>(null);
  private pacientes = new BehaviorSubject<Paciente[]>([]);
  private pacienteCreado:Paciente
  private paciente$: Subject<Paciente>;

  constructor(private http: HttpClient) { }

  createPaciente(paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.URI, paciente).pipe(
      map(response => {
        this.pacienteCreado = response
        const newPacientes = [this.pacienteCreado, ...this.pacientes.getValue()];
        this.pacientes.next(newPacientes);
        this.paciente.next(this.pacienteCreado);
        return this.pacienteCreado;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
