import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoEspecialidad, CatalogoRol, CatalogoTitulo } from 'src/app/models/Catalogo.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { SharedService } from 'src/app/services/shared.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { textValidator, emailValidator } from '../../../shared/utils/validador';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {

  id: string;
  usuario:Usuario;
  formularioUsuario:FormGroup;
  tituloCard: string;
  idUsuario:string;
  fecha_creacion:string;
  nombre_usuario_creador:string;
  textoPerfil: boolean = false;

  catRoles:CatalogoRol[] = [];
  catTitulos:CatalogoTitulo[] = [];
  catEspecialidades:CatalogoEspecialidad[] = [];

  //mensajes
  campoRequerido: string;
  correoValido: string;
  contrasenaLongitud: string;
  telefonoLongitud: string;
  soloLetras: string;
  soloNumeros: string;
  longitudMinima: string
  caracteresNoPermitidos: string
  
  rol:string
  descRol:string
  mismoUsuario:boolean;
  editando: boolean = false;

  mostrar_actualizacion:boolean=false
  nombre_usuario_actualizo:string
  //fecha_actual:string;
  fecha_actualizacion:string

  constructor(
    private authService:AuthService,
    private formBuilder:FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private usuarioService:UsuarioService, 
    private router: Router,
    private catalogoService:CatalogoService,
    private spinner: NgxSpinnerService, 
    private sharedService:SharedService,
    private cifradoService: CifradoService,
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
      this.contrasenaLongitud = Mensajes.CONTRASENA_LONGITUD;
      this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
      this.soloNumeros = Mensajes.SOLO_NUMEROS;
      this.soloLetras = Mensajes.SOLO_LETRAS;
      this.longitudMinima = Mensajes.LONGITUD_MINIMA;
      this.caracteresNoPermitidos = Mensajes.CARACTERES_NO_PERMITIDOS
    }

  ngOnInit() {

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1"){

        this.formularioUsuario = this.formBuilder.group({
          correo: [''],
          llave: [''],
          rol: ['null', Validators.required],
          titulo: ['null'],
          nombre: ['', [Validators.required, Validators.minLength(3), textValidator()]],
          apellidop: ['', [Validators.required, Validators.minLength(3), textValidator()]],
          apellidom: ['', [Validators.minLength(3), textValidator()]],
          especialidad: ['null'],
          telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
        })

        const url = this.router.url;

        // Verifica si la URL contiene 'perfil' o 'cuenta'
        this.textoPerfil = url.includes('perfil');
        console.log("Es PErfil: "+this.textoPerfil)
    
        this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          if(this.id == localStorage.getItem('_us')){
            console.log("Mismo usuario")
            this.mismoUsuario = true;
          }else{
            console.log("Otro usuario")
            this.mismoUsuario = false;
          }
          
          this.spinner.show()
          this.usuarioService.getUsuario$(this.id).subscribe(res => {
            this.spinner.hide()   
            this.usuario = res;
            this.descRol = res.desc_rol;
            console.log(res)
            console.log("id Especialidad:" + res.id_especialidad)
            this.tituloCard = this.usuario.nombre+' '+this.usuario.apellidop+' '+this.usuario.apellidom
            this.idUsuario=this.usuario.id
            this.fecha_creacion=this.usuario.fecha_creacion
            this.nombre_usuario_creador = this.usuario.nombre_usuario_creador
            this.nombre_usuario_actualizo = this.usuario.nombre_usuario_actualizo
            this.fecha_actualizacion = this.usuario.fecha_actualizacion
    
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

            if(this.usuario.nombre_usuario_actualizo ==null || this.usuario.nombre_usuario_actualizo ==''){
              this.mostrar_actualizacion = false
            }else{
              this.mostrar_actualizacion = true
            }
    
            // carga Catálogos
            this.cargarRoles()
            this.cargarTitulos()
            this.cargarEspecialidades()
          },
          err => {
            this.spinner.hide() 
            console.log("error: " + err)
          })
    
        },
          err => console.log("error: " + err)
        );

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

  selectedIdUser() {
    console.log("id seleccionado: "+this.id)
    this.router.navigate(['/password', this.id]);
  }

  actualizarUsuario(){  
    console.log("Actualizar usuario:")

    var updateUsuarioJson = JSON.parse(JSON.stringify(this.formularioUsuario.value))
    updateUsuarioJson.id_usuario_actualizo=localStorage.getItem("_us"),
    updateUsuarioJson.id_clinica=localStorage.getItem("_cli"),
    updateUsuarioJson.fecha_actualizacion=DateUtil.getCurrentFormattedDate()

    console.log(updateUsuarioJson)
    this.spinner.show();
    this.usuarioService.updateUsuario(this.usuario.id, updateUsuarioJson).subscribe({
      next: res => {
        this.spinner.hide();
        this.usuario=res
        console.log("Usuario actualizado ");
        console.log(res)

        //Sólo cuando el usuario en sesion actualiza sus datos
        if(this.usuario.id == localStorage.getItem('_us')){
          this.sharedService.setNombreUsuario(this.usuario.nombre +' '+this.usuario.apellidop);
        }
        
        this.editando=false
        this.ngOnInit()
        Alerts.success(Mensajes.USUARIO_ACTUALIZADO, `${this.usuario.nombre} ${this.usuario.apellidop} ${this.usuario.apellidom}`);
      },
      error: err => {
        this.spinner.hide();
          console.log("error: " + err)
          Alerts.error(Mensajes.ERROR_500, Mensajes.USUARIO_NO_ACTUALIZADO, Mensajes.INTENTAR_MAS_TARDE);
      }
    })

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

  deleteUser(id: string) {
    Alerts.confirmDelete(Mensajes.USUARIO_ELIMINAR_QUESTION, `${this.usuario.nombre} ${this.usuario.apellidop} ${this.usuario.apellidom}`).then((result) => {
      if (result.value) {
        // Confirm
        const deleteUsuarioJson = {
          id_usuario_elimino:localStorage.getItem("_us"),
          id_clinica:localStorage.getItem("_cli"),
          fecha_eliminacion:DateUtil.getCurrentFormattedDate()
        }

        this.spinner.show();
        this.usuarioService.deleteUsuario(id, deleteUsuarioJson).subscribe(res => {
          console.log("Usuario eliminado:" + JSON.stringify(res));
          Alerts.success(Mensajes.USUARIO_ELIMINADO, `${this.usuario.nombre} ${this.usuario.apellidop} ${this.usuario.apellidom}`);
          this.router.navigate(['/usuarios']);
        },
          err => { 
            console.log("error: " + err);
            Alerts.error(Mensajes.ERROR_500, Mensajes.USUARIO_NO_ELIMINADO, Mensajes.INTENTAR_MAS_TARDE);
          }
        );
      }
    });
  }

}