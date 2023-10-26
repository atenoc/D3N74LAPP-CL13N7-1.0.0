import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CatalogoEspecialidad, CatalogoRol, CatalogoTitulo } from '../models/Catalogo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  URI_ROLES = environment.urlApiRoles
  URI_TITULOS = environment.urlApiTitulos
  URI_ESPECIALIDADES = environment.urlApiEspecialidades

  private roles = new BehaviorSubject<CatalogoRol[]>([]);
  private titulos = new BehaviorSubject<CatalogoTitulo[]>([]);
  private especialidades = new BehaviorSubject<CatalogoEspecialidad[]>([]);

  constructor(private http: HttpClient) { }

  getRoles$(id_us: string): Observable<CatalogoRol[]> {
    const url = `${this.URI_ROLES}?id_us=${id_us}`;
    this.http.get<CatalogoRol[]>(url).subscribe(
      res => {
        this.roles.next(res);
      },
      err => console.log(err)
    );
    return this.roles.asObservable();
  }

  getTitulos$(): Observable<CatalogoTitulo[]>{
    this.http.get<CatalogoTitulo[]>(this.URI_TITULOS).subscribe(
      res=>{
        this.titulos.next(res)
      },
      err => console.log(err)
    )
    return this.titulos.asObservable();
  }

  getEspecialidades$(): Observable<CatalogoEspecialidad[]>{
    this.http.get<CatalogoEspecialidad[]>(this.URI_ESPECIALIDADES).subscribe(
      res=>{
        this.especialidades.next(res)
      },
      err => console.log(err)
    )
    return this.especialidades.asObservable();
  }
}
