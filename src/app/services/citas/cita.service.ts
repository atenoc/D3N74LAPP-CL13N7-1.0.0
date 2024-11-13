import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cita, CitaEditar, CitaPaciente } from 'src/app/models/Cita.model';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  URI = environment.urlApiCitas
  private nuevaCitaSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  private citas = new BehaviorSubject<Cita[]>([]);

  constructor(private http: HttpClient) { }

  createCita(cita: any): Observable<Cita> {
    cita.id_usuario_creador = localStorage.getItem('_us')
    cita.id_clinica = localStorage.getItem('_cli')
    cita.fecha_creacion = DateUtil.getCurrentFormattedDate()
    return this.http.post<Cita>(this.URI, cita, { withCredentials: true });
  }

  createEvento(evento): Observable<Cita> {
    evento.id_usuario_creador = localStorage.getItem('_us')
    evento.id_clinica = localStorage.getItem('_cli')
    evento.fecha_creacion = DateUtil.getCurrentFormattedDate()
    return this.http.post<Cita>(`${this.URI}/evento`, evento, { withCredentials: true });
  }
  

  getCitas$(id_clinica): Observable<Cita[]>{
    this.http.get<Cita[]>(`${this.URI}/clinica/${id_clinica}`, { withCredentials: true }).subscribe(
      res=>{
        this.citas.next(res)
      },
      err => console.log(err)
    )
    return this.citas.asObservable();
  }

  getCitaById$(id: string) {
    return this.http.get<CitaEditar>(`${this.URI}/${id}`, { withCredentials: true });
  }
  

  // Método para emitir el evento de nueva cita
  emitirNuevaCita() {
    this.nuevaCitaSubject.next(null);
  }

  // Observable para que otros componentes se suscriban a eventos de nuevas citas
  onNuevaCita$(): Observable<void> {
    return this.nuevaCitaSubject.asObservable();
  }

  updateCita(id:string, cita: any) {
    cita.id_usuario_actualizo = localStorage.getItem('_us')
    cita.id_clinica = localStorage.getItem('_cli')
    cita.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<CitaEditar>(`${this.URI}/${id}`, cita, { withCredentials: true });
  }

  deleteCita(id: string): Observable<void> {
    const params = new HttpParams()
      .set('id_usuario_elimino', localStorage.getItem('_us'))
      .set('id_clinica', localStorage.getItem('_cli'))
      .set('fecha_eliminacion', DateUtil.getCurrentFormattedDate())
    return this.http.delete<void>(`${this.URI}/${id}`, { params, withCredentials: true });
  }

  getCitasByIdPaciente(id_paciente): Observable<CitaPaciente[]>{
    return this.http.get<CitaPaciente[]>(`${this.URI}/paciente/${id_paciente}`, { withCredentials: true });
  }

}
