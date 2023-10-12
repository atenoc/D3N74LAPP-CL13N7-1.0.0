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
  mensajeError: String
  mostrarError: Boolean
  correoUsuario: string
  usuario: Usuario
  formularioLogin:FormGroup

  //mensajes
  campoRequerido: string;
  correoValido: string;

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
            this.cifrado.setEncryptedRol(res.desc_rol)

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

  

  validaExisteCentro(){
    console.log("Validando Centro")
    console.log("Id_Usuario: "+localStorage.getItem('_us'))
    
  }

  /*
  actualizarUsuarioLogueado(correo){
    this.authService.cambiarUsuario(correo)
  }*/
}
