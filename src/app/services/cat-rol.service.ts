import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Catalogo } from '../models/Catalogo.model';

@Injectable({
  providedIn: 'root'
})
export class CatRolService {

  URI = environment.urlApiRoles

  private rol = new BehaviorSubject<Catalogo>(null);
  private roles = new BehaviorSubject<Catalogo[]>([]);
  private rolCreado:Catalogo 

  constructor(private http: HttpClient) { }

  createRol(user): Observable<Catalogo> {
    return this.http.post<Catalogo>(this.URI, user).pipe(
      map(response => {
        this.rolCreado = response
  
        const newUsuarios = [this.rolCreado, ...this.roles.getValue()];
        this.roles.next(newUsuarios);
  
        this.rol.next(this.rolCreado);
        return this.rolCreado;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  getRoles$(id_us: string): Observable<Catalogo[]> {
    const url = `${this.URI}?id_us=${id_us}`;
    this.http.get<Catalogo[]>(url).subscribe(
      res => {
        this.roles.next(res);
      },
      err => console.log(err)
    );
    return this.roles.asObservable();
  }
  

  getRol$(id: string){
    return this.http.get<Catalogo>(`${this.URI}/${id}`)
  }

  updateRol(id: string, descripcion: string) {
    return this.http.patch(`${this.URI}/${id}`, {descripcion});
  }

  deleteRol(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`).pipe(
      tap(() => {
        const roles = this.roles.getValue();
        const index = roles.findIndex(rol => rol.id === id);
        if (index !== -1) {
          roles.splice(index, 1);
          this.roles.next([...roles]);
        }
      })
    );
  }

}

