import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Mensajes } from 'src/app/shared/mensajes.config';
import { CatalogoEspecialidad, CatalogoRol, CatalogoTitulo } from 'src/app/models/Catalogo.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoService } from 'src/app/services/catalogo.service';

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

  constructor(
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
    }

  ngOnInit() {
    console.log("USUARIO FORM")
    this.el.nativeElement.querySelector('input').focus();
    this.formularioUsuario = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      llave: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],
      titulo: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidop: ['', [Validators.required, Validators.minLength(3)]],
      apellidom: [''],
      especialidad: [''],
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
  }

  getInputClass(controlName: string) {
    const control = this.formularioUsuario.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  crearUsuario(){
    this.spinner.show();
    console.log("CREAR USUARIO")

    var nuevoUsuarioJson = JSON.parse(JSON.stringify(this.formularioUsuario.value))
    nuevoUsuarioJson.id_usuario=localStorage.getItem('_us') 

    console.log("Usuario a registrar: "+ nuevoUsuarioJson)
    console.log(nuevoUsuarioJson)
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
