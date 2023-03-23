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

  // POST
  createUsuario(user) {
    return this.http.post<any>(this.URI, user)
  }

  // GET
  getUsuarios$(){
    this.http.get<Usuario[]>(this.URI).subscribe(
      res=>{
        this.usuarios$.next(res)
      },
      err => console.log(err)
    )
    return this.usuarios$.asObservable();
  }

  // GET
  getUsuario$(id: string) {
    this.http.get<Usuario>(`${this.URI}/${id}`).subscribe(
      res=>{
        this.usuario$.next(res)
      },
      err => console.log(err)
    )

    return this.usuario$.asObservable();
  }

  // PATCH
  updateUsuario(id: string, correo: string, llave: string, rol:string) {
    return this.http.patch(`${this.URI}/${id}`, {correo, llave, rol});
  }

  // DELETE
  deleteUsuario(id: string) {
    return this.http.delete(`${this.URI}/${id}`);
  }

  // GET One by
  getUsuarioByCorreo$(correo: string) {
    if(correo){
      this.http.get<Usuario>(`${this.URI}/usuarioxcorreo/${correo}`).subscribe(
        res=>{
          this.usuario$.next(res)
        },
        err => console.log(err)
      )
      return this.usuario$.asObservable();
    }else{
      return this.usuario$;
    }
  }

  // GET All by
  getUsuariosByUsuario$(id:string){
    this.http.get<Usuario[]>(`${this.URI}/usuario/${id}`).subscribe(
      res=>{
        this.usuarios$.next(res)
      },
      err => console.log(err)
    )
    return this.usuarios$.asObservable();
  }

}
