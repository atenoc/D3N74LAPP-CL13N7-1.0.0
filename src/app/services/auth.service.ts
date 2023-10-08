import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //URI = 'http://localhost:4000/api/seguridad';
  URI = environment.urlApiSeguridad

  constructor(
    private http: HttpClient, 
    private router:Router, 
    private sharedService:SharedService
    ) {
  }

  login(user){
    console.log("usuario enviado: "+ user)
    return this.http.post<any>(this.URI + '/login', user)
  }

  estaLogueado(){
    return !!localStorage.getItem('__tooqn')  // comprobamos si existe el token para retornar true:false
  }

  getToken(){
    return localStorage.getItem('__tooqn')
  }

  logout(){

    Swal.fire({
      title: `¡Cerrar Sesión!`,
      text: "¿Estás seguro que deseas salir?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        localStorage.removeItem('__tooqn')
        localStorage.removeItem('_us')
        localStorage.removeItem('_us_em')
        this.router.navigate(['/login'])

        // Se manda un mensaje para validar el cierre de sesion y refrescar el menu 
        this.sharedService.cambiarMensaje("refresh_navigate")

        Swal.fire({
          icon: 'info',
          html:
            `<strong> ¡Hasta pronto! </strong><br/>`,
          showConfirmButton: false,
          timer: 1500
        }) 
      }
    })
  }
}

