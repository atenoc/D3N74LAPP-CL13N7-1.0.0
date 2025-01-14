import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { CatalogoEspecialidad, CatalogoRol, CatalogoTitulo } from 'src/app/models/Catalogo.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { AuthService } from 'src/app/services/auth.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { textValidator, emailValidator } from '../../../shared/utils/validador';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuario:Usuario
  formularioUsuario:FormGroup
  catRoles:CatalogoRol[] = [];
  catTitulos:CatalogoTitulo[] = [];
  catEspecialidades:CatalogoEspecialidad[] = [];

  //mensajes
  campoRequerido: string;
  correoValido: string;
  contrasenaLongitud: string;
  telefonoLongitud: string;
  soloNumeros: string;
  soloLetras: string;
  longitudMinima: string
  caracteresNoPermitidos: string

  rol:string
  //fecha_actual:string
  isDisabled:boolean = false

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private formBuilder:FormBuilder, 
    private usuarioService:UsuarioService, 
    private router: Router, 
    private el: ElementRef,
    private catalogoService:CatalogoService,
    private spinner: NgxSpinnerService, 
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
      this.contrasenaLongitud = Mensajes.CONTRASENA_LONGITUD;
      this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
      this.soloNumeros = Mensajes.SOLO_NUMEROS;
      this.soloLetras = Mensajes.SOLO_LETRAS;
      this.longitudMinima = Mensajes.LONGITUD_MINIMA;
      this.caracteresNoPermitidos = Mensajes.CARACTERES_NO_PERMITIDOS;
    }

  ngOnInit() {
    console.log("USUARIO FORM")
    
    if(this.authService.validarSesionActiva()){

      if(this.cifradoService.getDecryptedIdPlan() == '0402PF3T'){
        this.isDisabled = true
        console.log("Prueba 30 terminada");
      }

      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1"){
        this.el.nativeElement.querySelector('input').focus();
        this.formularioUsuario = this.formBuilder.group({
          correo: ['', Validators.compose([
            Validators.required, (control: AbstractControl) => { // Validación condicional del correo electrónico
              if (control.value && control.value.trim() !== '') {
                return emailValidator(control);
              }
            }
          ])],
          llave: ['', [Validators.required, Validators.minLength(6)]],
          rol: ['null', Validators.required],
          titulo: ['null'],
          nombre: ['', [Validators.required, Validators.minLength(3), textValidator()]],
          apellidop: ['', [Validators.required, Validators.minLength(3), textValidator()]],
          apellidom: ['', [Validators.minLength(3), textValidator()]],
          especialidad: ['null'],
          telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
        })

        // carga Catálogos
        this.catalogoService.getRoles$(localStorage.getItem('_us')).subscribe(res => { 
            this.catRoles = res
            //console.log("Roles: "+this.catRoles.length)
          },
          err => console.log("error: " + err)
        )
        this.catalogoService.getTitulos$().subscribe(res => { 
            this.catTitulos = res
            //console.log("Titulos: "+this.catTitulos.length)
          },
          err => console.log("error: " + err)
        )
        this.catalogoService.getEspecialidades$().subscribe(res => { 
            this.catEspecialidades = res
            //console.log("Especialidades: "+this.catEspecialidades.length)
          },
          err => console.log("error: " + err)
        )
        
        this.spinner.hide();
      }else{
        this.router.navigate(['/pagina/404/no-encontrada'])
      }

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }

  getInputClass(controlName: string) {
    const control = this.formularioUsuario.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  crearUsuario(){
    console.log("CREAR USUARIO")

    var nuevoUsuarioJson = JSON.parse(JSON.stringify(this.formularioUsuario.value))
    nuevoUsuarioJson.id_usuario_creador=localStorage.getItem('_us')
    nuevoUsuarioJson.id_clinica=localStorage.getItem("_cli"), 
    nuevoUsuarioJson.fecha_creacion = DateUtil.getCurrentFormattedDate()
    
    if(this.rol == "suadmin" || this.rol == "adminn1"){
      nuevoUsuarioJson.id_clinica=localStorage.getItem('_cli') 
    }

    console.log("Usuario a registrar: "+ nuevoUsuarioJson)
    console.log(nuevoUsuarioJson)
    
    this.spinner.show();
    this.usuarioService.createUsuario(nuevoUsuarioJson).subscribe(
      res => {
        this.spinner.hide();
        this.usuario = res;
        console.log("Usuario creado")
        //this.modalService.dismissAll()

        this.router.navigate(['/usuarios'])
        Alerts.success(Mensajes.USUARIO_REGISTRADO, `${this.usuario.correo}`);
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err.error.message)
        if(err.error.message=="400"){
          this.el.nativeElement.querySelector('input').focus();
          Alerts.warning(Mensajes.WARNING, Mensajes.CORREO_EXISTENTE);
        }else{
          Alerts.error(Mensajes.ERROR_500, Mensajes.USUARIO_NO_REGISTRADO, Mensajes.INTENTAR_MAS_TARDE);
        }
      }
    )
  }// end method

  limpiarForm(){
    this.formularioUsuario.reset();
    console.log("Limpiando formulario")
  }

}