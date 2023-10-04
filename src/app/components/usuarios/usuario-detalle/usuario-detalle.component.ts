import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo } from 'src/app/models/Catalogo.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { CatEspecialidadService } from 'src/app/services/cat-especialidad.service';
import { CatRolService } from 'src/app/services/cat-rol.service';
import { CatTituloService } from 'src/app/services/cat-titulo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {

  id: string;
  usuario:Usuario;
  formularioUsuario:FormGroup;
  editando: boolean = false;
  tituloCard: string;
  idUsuario:string;
  fecha_creacion:Date;

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
    private activatedRoute: ActivatedRoute, 
    private usuarioService:UsuarioService, 
    private router: Router,
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

    //this.el.nativeElement.querySelector('input').focus();
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

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.usuarioService.getUsuario$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
        this.usuario = res;
        console.log(res)
        console.log("id Especialidad:" + res.id_especialidad)
        console.log("usuario obtenido:" + JSON.stringify(res))
        this.tituloCard = this.usuario.nombre+' '+this.usuario.apellidop+' '+this.usuario.apellidom
        this.idUsuario=this.usuario.id
        this.fecha_creacion=this.usuario.fecha_creacion

        this.formularioUsuario.patchValue({
          correo: this.usuario.correo,
          llave: this.usuario.llave,
          rol: this.usuario.id_rol,
          titulo: this.usuario.id_titulo,
          nombre: this.usuario.nombre,
          apellidop: this.usuario.apellidop,
          apellidom: this.usuario.apellidom,
          especialidad: this.usuario.id_especialidad,
          telefono: this.usuario.telefono
        });

        // carga Catálogos
        this.cargarRoles()
        this.cargarTitulos()
        this.cargarEspecialidades()
        
      },
        err => console.log("error: " + err)
      )

    },
      err => console.log("error: " + err)
    );

  }

  getInputClass(controlName: string) {
    const control = this.formularioUsuario.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  selectedIdUser() {
    console.log("id seleccionado: "+this.id)
    this.router.navigate(['/password', this.id]);
  }

  actualizarUsuario(){
    console.log("Actualizar usuario:")
    console.log(this.formularioUsuario)

    this.usuarioService.updateUsuario(
      this.usuario.id, 
      this.formularioUsuario.value.correo,
      this.formularioUsuario.value.llave,
      this.formularioUsuario.value.rol,
      this.formularioUsuario.value.titulo,
      this.formularioUsuario.value.nombre,
      this.formularioUsuario.value.apellidop,
      this.formularioUsuario.value.apellidom,
      this.formularioUsuario.value.especialidad,
      this.formularioUsuario.value.telefono,
      ).subscribe(res => {
        console.log("Usuario actualizado: "+res);
        //this.router.navigate(['/usuarios']);
        this.editando=false
        this.ngOnInit()
        Swal.fire({
          position: 'top-end',
          //icon: 'success',
          html:
            `<h5>Información actualizada</h5>`+
            `<span>Usuario: ${ this.usuario.correo }</span>`, 
            
          showConfirmButton: false,
          //confirmButtonColor: '#28a745',
          timer: 3000,
          backdrop: false, // Deshabilita el fondo oscuro
          width: 400,
          background: 'rgb(40, 167, 69, .90)',
          color:'white',
          //iconColor: 'white',
          timerProgressBar:true
        })

      },
        err => {
          console.log("error: " + err)
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ err.error.message }</strong></br>`+
              `<span>¡Por favor intente más tarde!</span></br>`+
              `<small>Si el problema persiste, coctacte a su administrador.</small>`,
            showConfirmButton: false,
            //confirmButtonColor: '#28a745',
            timer: 10000
          })
        }
      );

    return false;
  }

  cargarRoles(){
    this.catRolService.getRoles$(localStorage.getItem('_us')).subscribe(res => { 
      this.catRoles = res
      console.log("Roles: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

  cargarTitulos(){
    this.catTituloService.getTitulos$().subscribe(res => { 
      this.catTitulos = res
      console.log("Titulos: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

  cargarEspecialidades(){
    this.catEspecialidadService.getEspecialidades$().subscribe(res => { 
      this.catEspecialidades = res
      console.log("Especialidades: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

}
