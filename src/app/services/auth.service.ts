import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //URI = 'http://localhost:4000/api/seguridad';
  URI = environment.urlApiSeguridad

  private usuario$: Subject<Usuario>;

  // usuario almacenado en localstorage, para al actualizar la página obtenga el usuario logueado en el componente navigate
  //private messageSource = new BehaviorSubject<string>(localStorage.getItem('usuario')) 
  //mensajeActual = this.messageSource.asObservable()

  constructor(private http: HttpClient, private router:Router) {
    this.usuario$ = new Subject();
  }

  registro(user){
    return this.http.post<any>(this.URI + '/registro', user)
  }

  login(user){
    console.log("usuario enviado: "+ JSON.stringify(user))
    return this.http.post<any>(this.URI + '/login', user)
  }

  getUsuarioByCorreo$(correo: string) {
    //console.log("Auth service | correo: "+correo)
    if(correo){
      this.http.get<Usuario>(`${this.URI}/userbycorreo/${correo}`).subscribe(
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

  estaLogueado(){
    return !!localStorage.getItem('token')  // comprobamos si existe el token para retornar true:false
  }

  getToken(){
    return localStorage.getItem('token')
  }

  logout(){

    Swal.fire({
      title: `¡Cerrar Sesión!`,
      text: "¿Estás seguro que deseas salir?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        /*si dan clic en si, eliminar */

        localStorage.removeItem('token')
        localStorage.removeItem('id_us')
        localStorage.removeItem('correo_us')

        this.router.navigate(['/login'])
    
        setTimeout(() => {
          //this.spinner.hide() 
          //this.router.navigate(['/login'])  
        }, 500);
  
      }
    })

    
  }
  /*
  cambiarUsuario(message: string){
    this.messageSource.next(message)
  }*/
}

