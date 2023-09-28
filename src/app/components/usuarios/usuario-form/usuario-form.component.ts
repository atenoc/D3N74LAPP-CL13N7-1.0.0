import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Mensajes } from 'src/app/shared/mensajes.config';
import { CatRolService } from 'src/app/services/cat-rol.service';
import { Catalogo } from 'src/app/models/Catalogo.model';
import { CatTituloService } from 'src/app/services/cat-titulo.service';
import { CatEspecialidadService } from 'src/app/services/cat-especialidad.service';
//import { CatRolesService } from 'src/app/services/cat-roles.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuario:Usuario
  formularioUsuario:FormGroup
  idCentroUsuarioActivo:string

  catRoles:Catalogo[] = [];
  catTitulos:Catalogo[] = [];
  catEspecialidades:Catalogo[] = [];

  //mensajes
  campoRequerido: string;
  correoValido: string;
  contrasenaLongitud: string;
  telefonoLongitud: string;
  soloNumeros: string;

  constructor(
    private formBuilder:FormBuilder, 
    private usuarioService:UsuarioService, 
    private centroService:CentroService,
    private modalService: NgbModal, 
    private el: ElementRef,
    private catRolService:CatRolService,
    private catTituloService:CatTituloService,
    private catEspecialidadService:CatEspecialidadService
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

    //get ID Centro
    this.centroService.getCentroByIdUser$(localStorage.getItem('_us')).subscribe(
      res => { 
        this.idCentroUsuarioActivo=res.id
      },
      err => console.log("error: " + err)
    )

    // carga Catálogos
    this.catRolService.getRoles$().subscribe(res => { 
        this.catRoles = res
        console.log("Roles: "+res.length)
      },
      err => console.log("error: " + err)
    )
    this.catTituloService.getTitulos$().subscribe(res => { 
        this.catTitulos = res
        console.log("Titulos: "+res.length)
      },
      err => console.log("error: " + err)
    )
    this.catEspecialidadService.getEspecialidades$().subscribe(res => { 
        this.catEspecialidades = res
        console.log("Especialidades: "+res.length)
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
    console.log("CREAR USUARIO")

    var nuevoUsuarioJson = JSON.parse(JSON.stringify(this.formularioUsuario.value))
    nuevoUsuarioJson.id_usuario=localStorage.getItem('_us') 
    nuevoUsuarioJson.id_centro=this.idCentroUsuarioActivo
    console.log("ID Centro Activo: "+this.idCentroUsuarioActivo)
    //console.log("Usuario a registrar: "+ JSON.stringify(nuevoUsuarioJson))
    console.log("Usuario a registrar: "+ nuevoUsuarioJson)
    console.log(nuevoUsuarioJson)
    this.usuarioService.createUsuario(nuevoUsuarioJson).subscribe(
      res => {
        this.usuario = res;
        console.log("Usuario creado")
        this.modalService.dismissAll()

        Swal.fire({
          icon: 'success',
          html:
            `<strong> ${ this.usuario.correo } </strong><br/>` +
            '¡Registrado con éxito!',
          //text:`El usuario: ${ this.usuario.correo }, se registró con éxito`,
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 1500
        })
      },
      err => {
        console.log("error: " + err.error.message)
        if(err.error.message=="200"){
          // Ya existe usuario
          this.el.nativeElement.querySelector('input').focus();
          Swal.fire({
            icon: 'warning',
            html:
              `<strong> Aviso </strong><br/>` +
              '¡Este correo ya se encuentra registrado!',
            showConfirmButton: true,
            confirmButtonColor: '#28a745',
            timer: 3000
          })
        }else{
          Swal.fire({
            icon: 'error',
            html:
              `<strong>¡${ err.error.message }!</strong>`,
            showConfirmButton: true,
            confirmButtonColor: '#28a745',
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
