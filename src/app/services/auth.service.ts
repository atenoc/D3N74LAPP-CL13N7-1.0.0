import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //URI = 'http://localhost:4000/api/seguridad';
  URI = environment.urlApiSeguridad

  // usuario almacenado en localstorage, para al actualizar la página obtenga el usuario logueado en el componente navigate
  private messageSource = new BehaviorSubject<string>(localStorage.getItem('usuario')) 
  mensajeActual = this.messageSource.asObservable()

  constructor(private http: HttpClient, private router:Router) { }

  registro(user){
    return this.http.post<any>(this.URI + '/registro', user)
  }

  login(user){
    console.log("usuario enviado: "+ JSON.stringify(user))
    return this.http.post<any>(this.URI + '/login', user)
  }

  correoByUsuario(correo: string) {
    return this.http.get<Usuario>(`${this.URI}/userbycorreo/${correo}`);
  }

  estaLogueado(){
    return !!localStorage.getItem('token')  // comprobamos si existe el token para retornar true:false
  }

  getToken(){
    return localStorage.getItem('token')
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('id_us')
    localStorage.removeItem('usuario')

    this.router.navigate(['/login'])
  }

  cambiarUsuario(message: string){
    this.messageSource.next(message)
  }
}

