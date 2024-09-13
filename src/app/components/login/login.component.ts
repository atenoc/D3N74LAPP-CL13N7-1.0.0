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
import { Centro } from 'src/app/models/Centro.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  correoUsuario: string
  usuario: Usuario
  centro: Centro
  rol:string
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

    this.correoUsuario = this.formularioLogin.value.correo
    const llaveEncripted = this.cifradoService.getEncryptedPassword(this.formularioLogin.value.llave); 
    console.log("pass:: "+llaveEncripted)

    const userJson = {
      correo: this.correoUsuario,
      llave: llaveEncripted,
      fecha: DateUtil.getCurrentFormattedDate()
    };

    
    this.spinner.show();
    this.authService.login(userJson).subscribe(
      res => {
        //Obtenemos el token de la sesion
        this.cifradoService.setEncryptedToken(res.token)

        //Almacenamos el correo 
        localStorage.setItem('_em', this.correoUsuario)

        const correoJson = {
          correo:localStorage.getItem('_em')
        }

        /* Obtener usuario por Correo */
        this.authService.getUsuarioByCorreo$(correoJson).subscribe(
          res => {
            this.usuario=res
            this.sharedService.setNombreUsuario(this.usuario.nombre +" "+this.usuario.apellidop)
    
            localStorage.setItem('_cli', this.usuario.id_clinica)

            //console.log("Rol:: "+res.rol)
            localStorage.setItem('_us', this.usuario.id)
            this.cifradoService.setEncryptedRol(this.usuario.rol)

            //console.log("id Plan a localstorage 2: " +res.id_plan)
            this.cifradoService.setEncryptedIdPlan(this.usuario.id_plan)
            //console.log("id_plan: " +this.cifradoService.getDecryptedIdPlan())

            this.rol=this.usuario.rol

            if(this.rol =="suadmin" || this.rol =="sop"){

              this.centroService.getCentroByIdUserSuAdmin(res.id).subscribe(
                res => {
                  
                  this.sharedService.setNombreClinica(this.usuario.nombre);
                  console.log("SU admin existe Clinica")
                  if(this.rol =="suadmin"){
                    this.validarPlanGratuito()
                  }                 
                  this.router.navigate(['/calendario'])
                },
                err => {
                  console.log("No existe Centro")
                  console.log(err)
                  this.router.navigate(['/configuracion/perfil/usuario'])
                }
              )
            }else{
              this.centroService.getCentro$(this.usuario.id_clinica).subscribe(
                res => {
                  this.centro = res
                  this.sharedService.setNombreClinica(this.centro.nombre);
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