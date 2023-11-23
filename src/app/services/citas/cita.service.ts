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

  private cita = new BehaviorSubject<Cita>(null);
  private citas = new BehaviorSubject<Cita[]>([]);
  private citaCreada:Cita
  private cita$: Subject<Cita>;

  constructor(private http: HttpClient) { }

  createCita(cita): Observable<Cita> {
    return this.http.post<Cita>(this.URI, cita).pipe(
      map(response => {
        this.citaCreada = response
        const newCitas = [this.citaCreada, ...this.citas.value];
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
  

  getCitas$(): Observable<Cita[]>{
    this.http.get<Cita[]>(this.URI).subscribe(
      res=>{
        this.citas.next(res)
      },
      err => console.log(err)
    )
    return this.citas.asObservable();
  }

}
