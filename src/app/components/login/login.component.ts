import { AfterViewInit, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Auth } from 'src/app/models/Auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  correoUsuario: string
  id_usuario:string
  formularioLogin:FormGroup
  auth:Auth
  usuario: Usuario
  rol:string
  centro: Centro
  
  //2FA
  mostrarCodigoError:boolean = false
  mensajeCodigo:string

  //mensajes
  campoRequerido: string;
  correoValido: string;
  mensajeError: String
  mostrarError: Boolean
  mensajeDetalleError: String

  @ViewChild('content') content: TemplateRef<any>;
  digits: number[] = new Array(6); // Por ejemplo, para un código de 4 dígitos
  existe2FASecret:boolean=false

  constructor(
    private sharedService:SharedService, 
    private centroService:CentroService,
    private formBuilder:FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private spinner: NgxSpinnerService, 
    private el: ElementRef,
    private cifradoService: CifradoService,
    private planService: PlanesService,
    private modalService: NgbModal,
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
    const llaveEncripted = this.cifradoService.setEncryptedPassword(this.formularioLogin.value.llave); 
    console.log("pass:: "+llaveEncripted)

    const userJson = {
      correo: this.correoUsuario,
      llave: llaveEncripted,
      fecha: DateUtil.getCurrentFormattedDate()
    };

    this.spinner.show();
    this.authService.login(userJson).subscribe(
      res => {
        localStorage.setItem('_em', this.correoUsuario)
        console.log("PRIMER LOGIN: ")
        console.log(res)
        this.auth=res
        this.existe2FASecret=this.auth.secreto ? true:false
        this.id_usuario=this.auth.id_usuario

        if(this.auth.secreto){
          // validar 2FA
          console.log("Validar 2FA")
          this.openModal2FA(this.content)
        }else{
          // Token
          console.log("Token")
          this.cifradoService.setEncryptedToken(this.auth.token)
          this.validaUsuarioPorCorreo()
        }  
        
        this.mensajeError = ""
        this.mostrarError = false
        this.spinner.hide();
        console.log("**************************************** Fin login ****************************************************")
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
      }) 
  }

  validaUsuarioPorCorreo(){
    const correoJson = {
      correo:this.correoUsuario
    }

    this.authService.getUsuarioByCorreo$(correoJson).subscribe(
      res => {
        console.log("Valida Usuario por Correo:")
        console.log(this.usuario)
        this.usuario=res
        this.id_usuario=this.usuario.id
        this.rol=this.usuario.rol
        this.sharedService.setNombreUsuario(this.usuario.nombre +" "+this.usuario.apellidop)
        localStorage.setItem('_cli', this.usuario.id_clinica)
        localStorage.setItem('_us', this.usuario.id)
        this.cifradoService.setEncryptedRol(this.usuario.rol)
        this.cifradoService.setEncryptedIdPlan(this.usuario.id_plan)
        
        if(this.rol =="suadmin"){
          this.validaTieneClinicaSuperAdmin()
        }else{
          this.validaClinicaPerteneciente()
        }

        this.sharedService.notifyApp.emit();

      },
      err => {
        console.log(err.error.message)
        console.log(err)
      }
    )
  }

  validaTieneClinicaSuperAdmin(){
    console.log("Valida tiene clinica, id usuario:: "+this.id_usuario)
    this.centroService.getCentroByIdUserSuAdmin(this.id_usuario).subscribe(
      res => {
        console.log("SU admin tiene Clinica")
        this.centro=res
        
        this.sharedService.setNombreClinica(this.centro.nombre);
        //this.validarPlanGratuito()
        this.router.navigate(['/calendario'])
      },
      err => {
        console.log("No tiene Clínica")
        console.log(err)
        this.router.navigate(['/configuracion/perfil/usuario'])
      }
    )
  }

  validaClinicaPerteneciente(){
    this.centroService.getCentro$(this.usuario.id_clinica).subscribe(
      res => {
        console.log("Si pertenece a una Clinica")
        this.centro = res
        this.sharedService.setNombreClinica(this.centro.nombre);
        //this.validarPlanGratuito()
        this.router.navigate(['/calendario'])
      },
      err => {
        console.log("No pertenece a ninguna clínica")
        console.log(err)
        this.router.navigate(['/login'])
      }
    )
  }

  openModal2FA(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: false });
  }

  handleKeydown(event: KeyboardEvent, index: number) {
    const inputElements = document.querySelectorAll('input[type="tel"]');
    const currentInput = inputElements[index] as HTMLInputElement;

    // Si se presiona un número
    if (event.key >= '0' && event.key <= '9') {
        // Si el campo actual tiene un valor, mover el foco al siguiente
        if (currentInput.value.length === 1) {
            const nextInput = index + 1;
            if (nextInput < this.digits.length) {
                (inputElements[nextInput] as HTMLInputElement).focus();
            }
        }
    } 
    // Si se presiona Backspace
    else if (event.key === 'Backspace') {
        // Si el campo actual está vacío, mover el foco al anterior
        if (currentInput.value === '') {
            const prevInput = index - 1;
            if (prevInput >= 0) {
                (inputElements[prevInput] as HTMLInputElement).focus();
            }
        }
    }
  }

  // También puedes agregar un evento input para manejar el cambio de valor
  inputChanged(event: Event, index: number) {
      const inputElements = document.querySelectorAll('input[type="tel"]');
      const currentInput = inputElements[index] as HTMLInputElement;

      // Si el campo actual tiene un valor, mover el foco al siguiente
      if (currentInput.value.length === 1) {
          const nextInput = index + 1;
          if (nextInput < this.digits.length) {
              (inputElements[nextInput] as HTMLInputElement).focus();
          }
      }
  }

  onSubmit() {
    const code = Array.from(document.querySelectorAll('input[type="tel"]'))
        .map((input: HTMLInputElement) => input.value)
        .join('');
    console.log('Código ingresado:', code);
    
    // Limpiar los campos de entrada
    const inputElements = document.querySelectorAll('input[type="tel"]');
    inputElements.forEach((input: HTMLInputElement) => {
        input.value = ''; // Reiniciar el valor de cada input
    });

    // Opción para mover el foco de vuelta al primer input
    (inputElements[0] as HTMLInputElement).focus();

    const codigoVerificacion = this.cifradoService.setEncryptedCodigoVerificacion(code)
    this.authService.sendCodigoVerificacion(this.correoUsuario, code).subscribe(res=>{
      console.log("Codigo Enviado")
      console.log(res)
      this.mostrarCodigoError = false

      this.cifradoService.setEncryptedToken(res.token)
      this.validaUsuarioPorCorreo()

      this.modalService.dismissAll()
    },
    err => {
      console.log(err)
      this.mostrarCodigoError = true
      this.mensajeCodigo = "Código Inválido, vuelve a intentarlo"
      console.log("Código de verificación incorrecto")
    })
  }

  validarPlanGratuito(){
    console.log("Desencripar para validar...")
    const id_plan = this.cifradoService.getDecryptedIdPlan()  
    //console.log("Validar vigencia de plan gratuito:: " +id_plan);

    if(id_plan == '0401PF30'){
      this.planService.validarPlanGratuito(localStorage.getItem('_cli'), DateUtil.getDateYYYYMMDD()).subscribe(
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