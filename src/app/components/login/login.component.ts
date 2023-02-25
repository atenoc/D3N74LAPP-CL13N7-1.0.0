import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = { }
  mensajeError: String
  mostrarError: Boolean
  correoUsuario: string
  usuario: Usuario

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login(){
    console.log("Usuario a enviar <-")
    console.log(this.user)
    this.authService.login(this.user)
    .subscribe(
      res => {
        //Obtenemos el token de la sesion
        console.log("Respuesta token <-")
        console.log(res)
        //Almacenamos token
        localStorage.setItem('token', res.token)
          
        var userObject = JSON.parse(JSON.stringify(this.user))
        this.correoUsuario = userObject.correo
        //Almacenamos el correo 
        localStorage.setItem('correo_us', this.correoUsuario)

        /* Obtener usuario por Correo */
        this.getUsuarioByCorreo(this.correoUsuario)

        this.router.navigate(['/agenda'])
        this.mensajeError = ""
        this.mostrarError = false
        console.log("**************************************** Fin login ****************************************************")

      },
      err => {
        console.log(err.error.message)
        console.log(err)
        this.mensajeError = err.error.message + ", por favor revisa tu correo y contraseña."
        this.mostrarError = true
      }
    )  
  }

  getUsuarioByCorreo(correo){
    this.authService.getUsuarioByCorreo$(correo)
    .subscribe(
      res => {
        console.log("Id usuario logueado: " + res.id)
        //Almacenamos el Id del usuario obtenido
        localStorage.setItem('id_us', res.id)

        //Actualizamos el usuario logueado
        //this.actualizarUsuarioLogueado(res.correo)
      },
      err => {
        console.log(err.error.message)
        console.log(err)
      }
    )
  }

  /*
  actualizarUsuarioLogueado(correo){
    this.authService.cambiarUsuario(correo)
  }*/
}
