import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { Cita } from 'src/app/models/Cita.model';
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
  

  getCitas$(): Observable<Cita[]>{
    this.http.get<Cita[]>(this.URI).subscribe(
      res=>{
        this.citas.next(res)
      },
      err => console.log(err)
    )
    return this.citas.asObservable();
  }

  // Método para emitir el evento de nueva cita
  emitirNuevaCita() {
    this.nuevaCitaSubject.next(null);
  }

  // Observable para que otros componentes se suscriban a eventos de nuevas citas
  onNuevaCita$(): Observable<void> {
    return this.nuevaCitaSubject.asObservable();
  }

}
