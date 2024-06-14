import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Catalogo } from '../../models/Catalogo.model';

@Injectable({
  providedIn: 'root'
})
export class CatEspecialidadService {

  URI = environment.urlApiEspecialidades

  private especialidad = new BehaviorSubject<Catalogo>(null);
  private especialidades = new BehaviorSubject<Catalogo[]>([]);
  private especialidadCreada:Catalogo 

  constructor(private http: HttpClient) { }

  createEspecialidad(user): Observable<Catalogo> {
    return this.http.post<Catalogo>(this.URI, user).pipe(
      map(response => {
        this.especialidadCreada = response
  
        const newUsuarios = [this.especialidadCreada, ...this.especialidades.getValue()];
        this.especialidades.next(newUsuarios);
  
        this.especialidad.next(this.especialidadCreada);
        return this.especialidadCreada;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  getEspecialidades$(): Observable<Catalogo[]>{
    this.http.get<Catalogo[]>(this.URI).subscribe(
      res=>{
        this.especialidades.next(res)
      },
      err => console.log(err)
    )
    return this.especialidades.asObservable();
  }

  getEspacialidad$(id: string){
    return this.http.get<Catalogo>(`${this.URI}/${id}`)
  }

  updateEspecialidad(id: string, descripcion: string) {
    return this.http.patch(`${this.URI}/${id}`, {descripcion});
  }

  deleteEspecialidad(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`).pipe(
      tap(() => {
        const roles = this.especialidades.getValue();
        const index = roles.findIndex(especialidad => especialidad.id === id);
        if (index !== -1) {
          roles.splice(index, 1);
          this.especialidades.next([...roles]);
        }
      })
    );
  }
}
