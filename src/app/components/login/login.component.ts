import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from '../../services/auth.service'
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //user = { }
  mensajeError: String
  mostrarError: Boolean
  correoUsuario: string
  usuario: Usuario
  formularioLogin:FormGroup

  constructor(private formBuilder:FormBuilder, private authService: AuthService, private usuarioService:UsuarioService, private router: Router) { }

  ngOnInit() {
    this.formularioLogin = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      llave: ['', Validators.required]
    })
  }

  login(){
    
    this.authService.login(this.formularioLogin.value).subscribe(
      res => {
        //Obtenemos el token de la sesion
        console.log("Respuesta token <-")
        console.log(res)

        //Almacenamos token
        localStorage.setItem('token', res.token)
          
        var userObject = JSON.parse(JSON.stringify(this.formularioLogin.value))
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

        Swal.fire({
          icon: 'warning',
          html:
            `<strong> ${ err.error.message  } </strong><br/>` +
            '<small> ¡Por favor verifica el correo y/o contraseña! </small> ',
          showConfirmButton: false,
          timer: 3000
        }) 

        this.mensajeError = err.error.message + ". ¡Por favor verifica el correo y/o contraseña!"
        this.mostrarError = true
      }
    ) 

  }

  getUsuarioByCorreo(correo){
    this.usuarioService.getUsuarioByCorreo$(correo)
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
