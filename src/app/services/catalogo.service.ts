import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Catalogo } from '../models/Catalogo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  URI_ROLES = environment.urlApiRoles
  URI_TITULOS = environment.urlApiTitulos
  URI_ESPECIALIDADES = environment.urlApiEspecialidades

  private roles = new BehaviorSubject<Catalogo[]>([]);
  private titulos = new BehaviorSubject<Catalogo[]>([]);
  private especialidades = new BehaviorSubject<Catalogo[]>([]);

  constructor(private http: HttpClient) { }

  getRoles$(id_us: string): Observable<Catalogo[]> {
    const url = `${this.URI_ROLES}?id_us=${id_us}`;
    this.http.get<Catalogo[]>(url).subscribe(
      res => {
        this.roles.next(res);
      },
      err => console.log(err)
    );
    return this.roles.asObservable();
  }

  getTitulos$(): Observable<Catalogo[]>{
    this.http.get<Catalogo[]>(this.URI_TITULOS).subscribe(
      res=>{
        this.titulos.next(res)
      },
      err => console.log(err)
    )
    return this.titulos.asObservable();
  }

  getEspecialidades$(): Observable<Catalogo[]>{
    this.http.get<Catalogo[]>(this.URI_ESPECIALIDADES).subscribe(
      res=>{
        this.especialidades.next(res)
      },
      err => console.log(err)
    )
    return this.especialidades.asObservable();
  }
}
