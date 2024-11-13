import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Centro } from '../../models/Centro.model';
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
    return this.http.post<Centro>(this.URI, centro, { withCredentials: true }).pipe(
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

  // GET TODOSSSSSSS
  getCentros$(): Observable<Centro[]>{
    this.http.get<Centro[]>(this.URI, { withCredentials: true }).subscribe(
      res=>{
        this.centros.next(res)
      },
      err => console.log(err)
    )
    return this.centros.asObservable();
  }

  // get 1 Centro
  getCentro$(id: string){
    return this.http.get<Centro>(`${this.URI}/${id}`, { withCredentials: true })
  }

  // PATCH One
  updateCentro(id: string, centro:any) {
    return this.http.patch(`${this.URI}/${id}`, centro, { withCredentials: true });
  }

  // DELETE One
  deleteCentro(id: string, centro:any): Observable<void> {
    return this.http.put<void>(`${this.URI}/${id}`, centro, { withCredentials: true })
  }

  get getCentroCreado$(): Observable<Centro> {
    return this.centro$.asObservable();
  }

  // GET One by
  getCentroByIdUserSuAdmin(id_usuario: string) {
    return this.http.get<Centro>(`${this.URI}/usuario/${id_usuario}`, { withCredentials: true })
  }

}
