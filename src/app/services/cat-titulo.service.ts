import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Catalogo } from '../models/Catalogo.model';

@Injectable({
  providedIn: 'root'
})
export class CatTituloService {

  URI = environment.urlApiTitulos

  private titulo = new BehaviorSubject<Catalogo>(null);
  private titulos = new BehaviorSubject<Catalogo[]>([]);
  private tituloCreado:Catalogo 

  constructor(private http: HttpClient) { }

  createTitulo(user): Observable<Catalogo> {
    return this.http.post<Catalogo>(this.URI, user).pipe(
      map(response => {
        this.tituloCreado = response
        const newUsuarios = [this.tituloCreado, ...this.titulos.getValue()];
        this.titulos.next(newUsuarios);
        this.titulo.next(this.tituloCreado);
        return this.tituloCreado;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  getTitulos$(): Observable<Catalogo[]>{
    this.http.get<Catalogo[]>(this.URI).subscribe(
      res=>{
        this.titulos.next(res)
      },
      err => console.log(err)
    )
    return this.titulos.asObservable();
  }

  getTitulo$(id: string){
    return this.http.get<Catalogo>(`${this.URI}/${id}`)
  }

  updateTitulo(id: string, descripcion: string) {
    return this.http.patch(`${this.URI}/${id}`, {descripcion});
  }

  deleteTitulo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`).pipe(
      tap(() => {
        const titulos = this.titulos.getValue();
        const index = titulos.findIndex(titulo => titulo.id === id);
        if (index !== -1) {
          titulos.splice(index, 1);
          this.titulos.next([...titulos]);
        }
      })
    );
  }
}
