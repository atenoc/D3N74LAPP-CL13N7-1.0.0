import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { Usuario } from '../models/Usuario.model';
import { Auth } from '../models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //URI = 'http://localhost:4000/api/seguridad';
  URI = environment.urlApiSeguridad

  constructor(
    private http: HttpClient, 
    private router:Router, 
    ) {
  }

  login(user){
    console.log("usuario enviado: "+ user)
    return this.http.post<Auth>(this.URI + '/login', user)
  }

  estaLogueado(){
    // comprobamos si existe el token para retornar true:false
    return !!localStorage.getItem('_enc_t')
  }

  validarSesionActiva(){
    return !!localStorage.getItem('_enc_t') 
        && !!localStorage.getItem('_us')
        && !!localStorage.getItem('_lor_')
        && !!localStorage.getItem('_em')
        && !!localStorage.getItem('_cli')
  }

  /*
  getToken(){
    return localStorage.getItem('__tooqn')
  }*/

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

        localStorage.removeItem('_enc_t')
        localStorage.removeItem('_lor_')
        localStorage.removeItem('_us')
        localStorage.removeItem('_em')
        localStorage.removeItem('_cli')
        localStorage.removeItem('_plan')
        localStorage.removeItem('dias_restantes_p_g')
        this.router.navigate(['/login'])

        // Se manda un mensaje para validar el cierre de sesion y refrescar el menu 
        //this.sharedService.cambiarMensaje("refresh_navigate")
        //this.sharedService.notifyApp.emit();
        //
        setTimeout(() => {
          window.location.reload();
          console.log("reload")
        }, 2000);

        Swal.fire({
          icon: 'info',
          html:
            `<strong> ¡ Hasta pronto :) ! </strong><br/>`,
          showConfirmButton: false,
          timer: 2000
        }) 
      }
    })
  }

  // getUserByCorreo - After Login 2
  getUsuarioByCorreo$(correo: any) {
    console.log("Correo Login: "+correo)
    return this.http.post<Usuario>(`${this.URI}/usuario/correo`,correo)
  }

  // verificar usuario activo - After Login 3 - Sidebar/Header/Footer
  validarUsuarioActivo$(user:any) {
    return this.http.post<Usuario>(`${this.URI}/valida/usuario/activo`,user)
  }

  
  getPassUsuario$(id: string){
    return this.http.get<Usuario>(`${this.URI}/${id}/contrasena`)
  }

  // updateUserPassword
  updateUsuarioLlave(id: string, llave: string){
    return this.http.patch<Usuario>(`${this.URI}/password/usuario/${id}`, { llave });
  }

  generarSecreto(id: string){
    return this.http.put<any>(`${this.URI}/genera-secreto/usuario/${id}`,{});
  }

  sendCodigoVerificacion(correo: string, codigoIngresado:string){
    return this.http.post<Auth>(`${this.URI}/validar-secreto`,{ correo, codigoIngresado });
  }
  
}