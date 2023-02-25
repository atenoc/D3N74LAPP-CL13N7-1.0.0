import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Usuario } from '../models/Usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //URI = 'http://localhost:4000/api/usuarios';
  URI = environment.urlApiUsuarios

  private usuarios$: Subject<Usuario[]>;
  private usuario$: Subject<Usuario>;

  constructor(private http: HttpClient, private router:Router) {
    this.usuarios$ = new Subject();
    this.usuario$ = new Subject();
   }

  createUsuario(user) {
    return this.http.post<any>(this.URI, user)
  }

  getUsuarios$(){
    this.http.get<Usuario[]>(this.URI).subscribe(
      res=>{
        this.usuarios$.next(res)
      },
      err => console.log(err)
    )
    return this.usuarios$.asObservable();
  }

  getUsuario$(id: string) {
    //return this.http.get<Usuario>(`${this.URI}/${id}`);
    this.http.get<Usuario>(`${this.URI}/${id}`).subscribe(
      res=>{
        this.usuario$.next(res)
      },
      err => console.log(err)
    )

    return this.usuario$.asObservable();
  }

  deleteUsuario(id: string) {
    return this.http.delete(`${this.URI}/${id}`);
  }

  updateUsuario(id: string, correo: string, llave: string, rol:string) {
    return this.http.patch(`${this.URI}/${id}`, {correo, llave, rol});
  }

}
