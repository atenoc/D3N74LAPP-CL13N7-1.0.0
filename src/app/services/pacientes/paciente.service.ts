import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { Paciente, PacientesPaginados } from 'src/app/models/Paciente.model';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
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

  // get Usuarios Paginados por id_clinica
  getPacientesByIdClinicaPaginados$(
    id_clinica:string,
    page: number,
    size: number,
    orderBy: string,
    way: string
  ): Observable<PacientesPaginados> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('orderBy', String(orderBy))
      .set('way', String(way));
  
    return this.http.get<PacientesPaginados>(`${this.URI}/paginacion/pacientes/${id_clinica}`, { params });
  }

  getPacienteById$(id: string) {
    return this.http.get<Paciente>(`${this.URI}/${id}`);
  }

  buscarPacientes(id_clinica: string, query: string, ): Observable<any> {
    return this.http.post(`${this.URI}/buscador/${id_clinica}`, { query });
  }

  updatePacienteCita(id: string, paciente:any) {
    paciente.id_usuario_actualizo = localStorage.getItem('_us')
    paciente.id_clinica = localStorage.getItem('_cli')
    paciente.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Paciente>(`${this.URI}/cita/paciente/${id}`, paciente);
  }

  updatePaciente(id: string, paciente:any) {
    paciente.id_usuario_actualizo = localStorage.getItem('_us')
    paciente.id_clinica = localStorage.getItem('_cli')
    paciente.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Paciente>(`${this.URI}/${id}`, paciente);
  }

  deletePaciente(id: string): Observable<void> {
    const params = new HttpParams()
      .set('id_usuario_elimino', localStorage.getItem('_us'))
      .set('id_clinica', localStorage.getItem('_cli'))
      .set('fecha_eliminacion', DateUtil.getCurrentFormattedDate())
    return this.http.delete<void>(`${this.URI}/${id}`, { params });
  }
}
