import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from '../../services/auth.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { CifradoService } from 'src/app/services/cifrado.service';
import { CentroService } from 'src/app/services/clinicas/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { PlanesService } from 'src/app/services/planes/planes.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  correoUsuario: string
  usuario: Usuario
  formularioLogin:FormGroup

  //mensajes
  campoRequerido: string;
  correoValido: string;
  mensajeError: String
  mostrarError: Boolean
  mensajeDetalleError: String

  fecha_actual:string

  constructor(
    private sharedService:SharedService, 
    private centroService:CentroService,
    private formBuilder:FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private spinner: NgxSpinnerService, 
    private el: ElementRef,
    private cifradoService: CifradoService,
    private planService: PlanesService
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
     }

  ngOnInit() {
    this.el.nativeElement.querySelector('input').focus();
    this.formularioLogin = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.required, this.emailValidator
      ])],
      llave: ['', Validators.required]
    })
  }

  emailValidator(control) {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { emailInvalido: true };
  }

  login(){
    this.spinner.show();

    var userObject = JSON.parse(JSON.stringify(this.formularioLogin.value))
    this.correoUsuario = userObject.correo
    const llaveEncripted = this.cifradoService.getEncryptedPassword(userObject.llave); 

    const newUserJson = {
      correo: userObject.correo,
      llave: llaveEncripted,
      fecha: DateUtil.getCurrentFormattedDate()
    };

    this.authService.login(newUserJson).subscribe(
      res => {
        //Obtenemos el token de la sesion
        this.cifradoService.setEncryptedToken(res.token)

        //Almacenamos el correo 
        localStorage.setItem('_em', this.correoUsuario)

        /* Obtener usuario por Correo */
        this.authService.getUsuarioByCorreo$(this.correoUsuario).subscribe(
          res => {

            this.sharedService.setNombreUsuario(res.nombre +" "+res.apellidop)
    
            console.log("Cli:: "+JSON.stringify(res.id_clinica))
            localStorage.setItem('_cli', res.id_clinica)

            console.log("Rol:: "+res.rol)
            localStorage.setItem('_us', res.id)
            this.cifradoService.setEncryptedRol(res.rol)

            console.log("id Plan a localstorage 2: " +res.id_plan)
            this.cifradoService.setEncryptedIdPlan(res.id_plan)
            console.log("id_plan: " +this.cifradoService.getDecryptedIdPlan())

            if(res.rol =="suadmin" || res.rol =="sop"){

              this.centroService.getCentroByIdUserSuAdmin(res.id).subscribe(
                res => {
                  
                  this.sharedService.setNombreClinica(res.nombre);
                  console.log("SU admin existe Clinica")
                  this.validarPlanGratuito()
                  this.router.navigate(['/calendario'])
                },
                err => {
                  console.log("No existe Centro")
                  console.log(err)
                  this.router.navigate(['/configuracion/perfil/usuario'])
                }
              )
            }else{
              this.centroService.getCentro$(res.id_clinica).subscribe(
                res => {
                  
                  this.sharedService.setNombreClinica(res.nombre);
                  //this.validarPlanGratuito()
                  console.log("Si pertenece a un centro")
                  this.router.navigate(['/calendario'])
                },
                err => {
                  console.log("No pertenece a ningún centro")
                  console.log(err)
                  this.router.navigate(['/login'])
                }
              )
            }

            this.sharedService.notifyApp.emit();

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
          this.mensajeDetalleError = Mensajes.SIN_CONEXION_RED +'. '+Mensajes.INTENTAR_MAS_TARDE
          Alerts.error(Mensajes.ERROR_500, Mensajes.SIN_CONEXION_RED, Mensajes.INTENTAR_MAS_TARDE);
        }else{
          this.mensajeDetalleError = Mensajes.CONTRASENA_VERIFICAR
          Alerts.warning(Mensajes.WARNING, Mensajes.CONTRASENA_VERIFICAR);
        }

        this.mensajeError = this.mensajeDetalleError
        this.mostrarError = true
      }
    ) 

  }

  validarPlanGratuito(){
    console.log("Desencripar para validar...")
    const id_plan = this.cifradoService.getDecryptedIdPlan()  
    //console.log("Validar vigencia de plan gratuito:: " +id_plan);

    if(id_plan == '0401PF30'){
      this.fecha_actual = DateUtil.getDateYYYYMMDD()

      this.planService.validarPlanGratuito(localStorage.getItem('_cli'), this.fecha_actual).subscribe(
          res => {
            console.log("Validando Plan")
            //console.log(res)

            const diasUsados = Number(res);
            const diasRestantes = 30 - diasUsados;

            this.sharedService.setDiasRestantesPlanGratuito(diasRestantes.toString());
            localStorage.setItem('dias_restantes_p_g', diasRestantes.toString())
          },
          err => {
            console.log("Error al invocar el plan")
          }
      )

    }

  }
 
}