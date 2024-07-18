import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import Swal from 'sweetalert2';
import { Mensajes } from 'src/app/shared/mensajes.config';
import { CatalogoEspecialidad, CatalogoRol, CatalogoTitulo } from 'src/app/models/Catalogo.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuario:Usuario
  formularioUsuario:FormGroup
  //idCentroUsuarioActivo:string

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

  rol:string

  date: Date;
  fecha_creacion:string

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
            Validators.required, this.emailValidator
          ])],
          llave: ['', [Validators.required, Validators.minLength(6)]],
          rol: ['null', Validators.required],
          titulo: ['null'],
          nombre: ['', [Validators.required, Validators.minLength(3), this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/) ]],
          apellidop: ['', [Validators.required, Validators.minLength(3), this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
          apellidom: ['', [this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
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
      }else{
        this.router.navigate(['/pagina/404/no-encontrada'])
      }

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }

  validarTexto(regex: RegExp) {
    return (control: AbstractControl) => {
      const value = control.value;
  
      if (value && !regex.test(value)) {
        return { 'invalidRegex': true };
      }
  
      return null;
    };
  }

  emailValidator(control) {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { emailInvalido: true };
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

    this.date = new Date();
    const mes = this.date.getMonth()+1;
    this.fecha_creacion = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"

    nuevoUsuarioJson.fecha_creacion = this.fecha_creacion
    
    if(this.rol == "suadmin" || this.rol == "adminn1"){
      nuevoUsuarioJson.id_clinica=localStorage.getItem('_cli') 
    }

    console.log("Usuario a registrar: "+ nuevoUsuarioJson)
    console.log(nuevoUsuarioJson)
    this.spinner.show();
    this.usuarioService.createUsuario(nuevoUsuarioJson).subscribe(
      res => {
        this.usuario = res;
        console.log("Usuario creado")
        //this.modalService.dismissAll()
      
        this.spinner.hide();
        this.router.navigate(['/usuarios'])
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.USUARIO_REGISTRADO }</h5>`+
            `<span>Usuario: ${ this.usuario.correo }</span>`, 
          showConfirmButton: false,
          backdrop: false,
          width: 400,
          background: 'rgb(40, 167, 69, .90)',
          color:'white',
          timerProgressBar:true,
          timer: 3000,
        })
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err.error.message)
        if(err.error.message=="400"){
          this.el.nativeElement.querySelector('input').focus();
          Swal.fire({
            icon: 'warning',
            html:
              `<strong> ${ Mensajes.WARNING } </strong><br/>` +
              `<span>${ Mensajes.CORREO_EXISTENTE }</span>`,
            showConfirmButton: false,
            timer: 2000
          })
        }else{
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
              `<span>${ Mensajes.USUARIO_NO_REGISTRADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        }
        
      }
    )
  }// end method

  limpiarForm(){
    this.formularioUsuario.reset();
    console.log("Limpiando formulario")
  }

}
