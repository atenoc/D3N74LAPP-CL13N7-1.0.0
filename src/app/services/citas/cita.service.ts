import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cita, CitaEditar } from 'src/app/models/Cita.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  URI = environment.urlApiCitas
  private nuevaCitaSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  private citas = new BehaviorSubject<Cita[]>([]);

  constructor(private http: HttpClient) { }

  createCita(cita): Observable<Cita> {
    return this.http.post<Cita>(this.URI, cita);
  }

  createEvento(evento): Observable<Cita> {
    return this.http.post<Cita>(`${this.URI}/evento`, evento);
  }
  

  getCitas$(id_clinica): Observable<Cita[]>{
    this.http.get<Cita[]>(`${this.URI}/clinica/${id_clinica}`).subscribe(
      res=>{
        this.citas.next(res)
      },
      err => console.log(err)
    )
    return this.citas.asObservable();
  }

  getCitaById$(id: string) {
    return this.http.get<CitaEditar>(`${this.URI}/${id}`);
  }
  

  // Método para emitir el evento de nueva cita
  emitirNuevaCita() {
    this.nuevaCitaSubject.next(null);
  }

  // Observable para que otros componentes se suscriban a eventos de nuevas citas
  onNuevaCita$(): Observable<void> {
    return this.nuevaCitaSubject.asObservable();
  }

  updateCita(id: string, title: string, motivo:string, start:string, end:string, nota:string, id_paciente:string) {
    return this.http.patch<CitaEditar>(`${this.URI}/${id}`, {title, motivo, start, end, nota, id_paciente});
  }

  deleteCita(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`);
  }

}
