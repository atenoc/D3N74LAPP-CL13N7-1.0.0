import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoEspecialidad, CatalogoRol, CatalogoTitulo } from 'src/app/models/Catalogo.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { CatalogoService } from 'src/app/services/catalogo.service';
import { SharedService } from 'src/app/services/shared.service';
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
    private activatedRoute: ActivatedRoute, 
    private usuarioService:UsuarioService, 
    private router: Router,
    //private el: ElementRef,
    private catalogoService:CatalogoService,
    private spinner: NgxSpinnerService, 
    private sharedService:SharedService
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
        //console.log("usuario obtenido:" + JSON.stringify(res))
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
      err => {
        console.log("error: " + err)
      })

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
    this.spinner.show();
    console.log("Actualizar usuario:")
    console.log(this.formularioUsuario)

    this.usuarioService.updateUsuario(
      this.usuario.id, 
      this.formularioUsuario.value.correo,
      this.formularioUsuario.value.rol,
      this.formularioUsuario.value.titulo,
      this.formularioUsuario.value.nombre,
      this.formularioUsuario.value.apellidop,
      this.formularioUsuario.value.apellidom,
      this.formularioUsuario.value.especialidad,
      this.formularioUsuario.value.telefono,
      ).subscribe(res => {
        console.log("Usuario actualizado: "+res);
        this.sharedService.setNombreUsuario(this.formularioUsuario.value.nombre);
        this.editando=false
        this.ngOnInit()
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.USUARIO_ACTUALIZADO }</h5>`+
            `<span>${ this.usuario.correo }</span>`, 
            
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
          console.log("error: " + err)
          //err.error.message
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
              `<span>${ Mensajes.USUARIO_NO_ACTUALIZADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        }
      );

    return false;
  }

  cargarRoles(){
    this.catalogoService.getRoles$(localStorage.getItem('_us')).subscribe(res => { 
      this.catRoles = res
      console.log("Roles: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

  cargarTitulos(){
    this.catalogoService.getTitulos$().subscribe(res => { 
      this.catTitulos = res
      console.log("Titulos: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

  cargarEspecialidades(){
    this.catalogoService.getEspecialidades$().subscribe(res => { 
      this.catEspecialidades = res
      console.log("Especialidades: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

  deleteUser(id: string, correo:string) {

    Swal.fire({
      html:
        `<h5>${ Mensajes.USUARIO_ELIMINAR_QUESTION }</h5> <br/> ` +
        `<strong> ${ correo } </strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        // Confirm
        this.usuarioService.deleteUsuario(id).subscribe(res => {
          console.log("Usuario eliminado:" + JSON.stringify(res))

          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.USUARIO_ELIMINADO }</h5>`+
              `<span>${ this.usuario.correo }</span>`, 
            showConfirmButton: false,
            backdrop: false, 
            width: 400,
            background: 'rgb(40, 167, 69, .90)',
            color:'white',
            timerProgressBar:true,
            timer: 3000,
          })

          this.router.navigate(['/usuarios']);
        },
          err => { 
            console.log("error: " + err)
            Swal.fire({
              icon: 'error',
              html:
                `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
                `<span>${ Mensajes.USUARIO_NO_ELIMINADO }</span></br>`+
                `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
              showConfirmButton: false,
              timer: 3000
            }) 
          }
        )
    
      }
    })

  }

}
