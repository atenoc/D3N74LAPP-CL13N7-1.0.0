import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from '../../services/auth.service'
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Mensajes } from 'src/app/shared/mensajes.config';

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

  //mensajes
  campoRequerido: string;
  correoValido: string;

  constructor(
    private formBuilder:FormBuilder, 
    private authService: AuthService, 
    private usuarioService:UsuarioService, 
    private router: Router,
    private spinner: NgxSpinnerService, 
    private el: ElementRef
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
     }

  ngOnInit() {
    this.el.nativeElement.querySelector('input').focus();
    this.formularioLogin = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      llave: ['', Validators.required]
    })
  }

  login(){
    this.spinner.show();
    this.authService.login(this.formularioLogin.value).subscribe(
      res => {
        //Obtenemos el token de la sesion
        console.log("Respuesta token <-")
        console.log(res)

        //Almacenamos token
        localStorage.setItem('__tooqn', res.token)
          
        var userObject = JSON.parse(JSON.stringify(this.formularioLogin.value))
        this.correoUsuario = userObject.correo
        //Almacenamos el correo 
        localStorage.setItem('_us_em', this.correoUsuario)

        /* Obtener usuario por Correo */
        this.getUsuarioByCorreo(this.correoUsuario)

        this.router.navigate(['/agenda'])
        this.mensajeError = ""
        this.mostrarError = false
        console.log("**************************************** Fin login ****************************************************")
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
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
        localStorage.setItem('_us', res.id)
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
