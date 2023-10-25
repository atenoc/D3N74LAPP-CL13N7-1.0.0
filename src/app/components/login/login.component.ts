import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from '../../services/auth.service'
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Mensajes } from 'src/app/shared/mensajes.config';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
import { CentroService } from 'src/app/services/centro.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //user = { }
  
  correoUsuario: string
  usuario: Usuario
  formularioLogin:FormGroup

  //mensajes
  campoRequerido: string;
  correoValido: string;
  mensajeError: String
  mostrarError: Boolean
  mensajeDetalleError: String

  constructor(
    private centroService:CentroService,
    private formBuilder:FormBuilder, 
    private authService: AuthService, 
    private usuarioService:UsuarioService, 
    private router: Router,
    private spinner: NgxSpinnerService, 
    private el: ElementRef,
    private cifrado: CifradoService
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
        //localStorage.setItem('__tooqn', res.token)
        this.cifrado.setEncryptedToken(res.token)

        var userObject = JSON.parse(JSON.stringify(this.formularioLogin.value))
        this.correoUsuario = userObject.correo
        //Almacenamos el correo 
        localStorage.setItem('_em', this.correoUsuario)

        /* Obtener usuario por Correo */
        this.usuarioService.getUsuarioByCorreo$(this.correoUsuario).subscribe(
          res => {
    
            localStorage.setItem('_us', res.id)
            this.cifrado.setEncryptedRol(res.rol)

            this.centroService.getCentroByIdUser$(res.id).subscribe(
              res => {
                console.log("Si existe Centro")
                this.router.navigate(['/agenda'])
              },
              err => {
                console.log("No existe Centro")
                console.log(err)
                this.router.navigate(['/configuracion/perfil/usuario'])
              }
            )
    
          },
          err => {
            console.log(err.error.message)
            console.log(err)
          }
        )
        
        this.mensajeError = ""
        this.mostrarError = false

        
        console.log("**************************************** Fin login ****************************************************")
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        console.log(err.error.message)
        console.log(err)

        if(err.error.message === undefined){
          this.mensajeDetalleError = Mensajes.SIN_CONEXION_RED
          Swal.fire({
            icon: 'error',
            html:
              `<strong> ${ Mensajes.ERROR_500 } </strong><br/>` +
              `<small> ${ Mensajes.SIN_CONEXION_RED } </small> `,
            showConfirmButton: false,
            timer: 3000
          }) 
        }else{
          this.mensajeDetalleError = Mensajes.CONTRASENA_VERIFICAR
          Swal.fire({
            icon: 'warning',
            html:
              `<strong> ${ Mensajes.WARNING } </strong><br/>` +
              `<small> ${ Mensajes.CONTRASENA_VERIFICAR } </small> `,
            showConfirmButton: false,
            timer: 3000
          }) 
        }

        this.mensajeError = this.mensajeDetalleError
        this.mostrarError = true
      }
    ) 

  }

}
