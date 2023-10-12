import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Centro } from '../models/Centro.model';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CentroService {

  //URI = 'http://localhost:4000/api/centros';
  URI = environment.urlApiCentros

  private centro = new BehaviorSubject<Centro>(null);
  private centros = new BehaviorSubject<Centro[]>([]);
  private centroCreado:Centro 
  private centro$: Subject<Centro>; // Para actualizar el centro creado desde el perfil

  constructor(private http: HttpClient) {
    this.centro$ = new Subject();
  }

  // POST One
  createCentro(centro): Observable<Centro> {
    return this.http.post<Centro>(this.URI, centro).pipe(
      map(response => {
        this.centroCreado = response
        const newCentros = [this.centroCreado, ...this.centros.getValue()];
        this.centros.next(newCentros);
        this.centro.next(this.centroCreado);

        // Emitir el valor del centro recién creado desde el perfil
        this.centro$.next(this.centroCreado);

        return this.centroCreado;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  // GET All
  getCentros$(): Observable<Centro[]>{
    this.http.get<Centro[]>(this.URI).subscribe(
      res=>{
        this.centros.next(res)
      },
      err => console.log(err)
    )
    return this.centros.asObservable();
  }

  // GET One
  getCentro$(id: string) {
    this.http.get<Centro>(`${this.URI}/${id}`).subscribe(
      res=>{
        this.centro$.next(res)
      },
      err => console.log(err)
    )
    return this.centro$.asObservable();
  }

  // PATCH One
  updateCentro(id: string, nombre: string, telefono: string, correo:string, direccion:string) {
    return this.http.patch(`${this.URI}/${id}`, {nombre, telefono, correo, direccion});
  }

  // DELETE One
  deleteCentro(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`).pipe(
      tap(() => {
        const centros = this.centros.getValue();
        const index = centros.findIndex(usuario => usuario.id === id);
        if (index !== -1) {
          centros.splice(index, 1);
          this.centros.next([...centros]);
        }
      })
    );
  }

  get getCentroCreado$(): Observable<Centro> {
    return this.centro$.asObservable();
  }

  // GET One by
  getCentroByIdUser$(id_usuario: string) {
    return this.http.get<Centro>(`${this.URI}/usuario/${id_usuario}`).pipe(
      catchError((err) => {
        return throwError(err); // Lanzar el error nuevamente para que lo maneje el componente
      })
    );
  }
}
