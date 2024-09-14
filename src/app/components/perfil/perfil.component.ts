import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/clinicas/centro.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import Swal from 'sweetalert2';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { AuditoriaService } from 'src/app/services/auditoria/auditoria.service';
import { Auditoria } from 'src/app/models/Auditoria.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario = {} as Usuario;
  centro: Centro = {} as Centro;
  auditoria: Auditoria = {} as Auditoria;

  rol:string
  mostrarOpciones:boolean=false
  accesoAnterior:string;
  existeAccesoAnterior:boolean = false
  nombreCompletoUsuario:string;

  nombre_usuario_creador:string
  fecha_creacion:string;
  nombre_usuario_actualizo:string
  fecha_actualizacion:string
  mostrar_actualizacion:boolean=false

  constructor(
    private spinner: NgxSpinnerService, 
    private authService:AuthService,
    private usuarioService:UsuarioService, 
    private centroService:CentroService, 
    private router:Router,
    private cifradoService: CifradoService,
    private auditoriaService:AuditoriaService,
    private sharedService:SharedService, 
    config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
    }

  ngOnInit() {
    console.log("PERFIL Component")
    if(this.authService.validarSesionActiva()){

      this.rol = this.cifradoService.getDecryptedRol();
      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1"){
        this.mostrarOpciones= true
      }

      // Consulta de Usuario
      this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
        res => {
          this.usuario = res;
          console.log(this.usuario )
          this.nombreCompletoUsuario = this.usuario.nombre +' '+this.usuario.apellidop+' '+this.usuario.apellidom
          // Consulta Centro del usuario
          this.cargaAccesoAnterior()
          this.cargarClinicaAsociada()
        },
        err => console.log("error: " + err)
      )  

    }

    this.sharedService.getNombreCompletoUsuario().subscribe(datoRecibido => {
      this.nombreCompletoUsuario = datoRecibido;
    });

  }

  cargaAccesoAnterior(){
    console.log("Cargando acceso...")
    this.auditoriaService.getAccesoByIdUsuario(localStorage.getItem('_us')).subscribe(
      res => {
        this.auditoria = res;
        console.log(this.auditoria )
        this.accesoAnterior=this.auditoria.fecha_evento
        this.existeAccesoAnterior = this.accesoAnterior ? true : false
      },
      err => console.log("error: " + err)
    )
  }

  cargarClinicaAsociada(){
    this.centroService.getCentro$(localStorage.getItem('_cli')).subscribe(
      res => {
        this.centro = res;

        this.nombre_usuario_creador = this.centro.nombre_usuario_creador
        this.fecha_creacion=this.centro.fecha_creacion
        this.nombre_usuario_actualizo = this.centro.nombre_usuario_actualizo
        this.fecha_actualizacion = this.centro.fecha_actualizacion
        console.log("nombre_usuario_actualizo: "+this.nombre_usuario_actualizo)
        this.mostrar_actualizacion = this.nombre_usuario_actualizo !=null ? true : false
        console.log("mostrar_actualizacion :: "+this.mostrar_actualizacion )
      },
      err => {
        console.log("error: " + err)
      }
    )
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  selectedIdContrasena(id: string) {
    console.log("id seleccionado: "+ id)
    this.router.navigate(['/password', id]);
  }

  selectedIdCentro(id: string) {
    console.log("id centro: "+id)
    this.router.navigate(['/centro-detalle', id]);
  }

  deleteCentroCuenta(id: string, nombre:string) {

    Swal.fire({
      html:
        `<h5>¿Estás seguro que quieres eliminar tu cuenta?</h5>` +
        `<strong> Clínica/consultorio: ${ nombre } </strong> <br/>`+
        `<small>Si deseas eliminar tu cuenta, ten en cuenta que también se borrará toda la información de tus usuarios, pacientes, médicos, citas, etc. Esta acción no se puede revertir.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        // Confirm

        const deleteClinicaJson = {
          id_usuario_elimino:localStorage.getItem("_us"),
          id_clinica:localStorage.getItem("_cli"),
          fecha_eliminacion:DateUtil.getCurrentFormattedDate()
        }

        this.spinner.show();
        setTimeout(() => {
          this.centroService.deleteCentro(id, deleteClinicaJson).subscribe(res => {
            this.spinner.hide();
            console.log("Centro eliminado:" + res)
            
            Alerts.success(Mensajes.CUENTA_ELIMINADA, Mensajes.CLINICA_ELIMINADA);

            setTimeout(() => {
              console.log("Cuenta eliminada")
              localStorage.removeItem('_enc_t')
              localStorage.removeItem('_lor_')
              localStorage.removeItem('_us')
              localStorage.removeItem('_em')
              localStorage.removeItem('_cli')
              window.location.reload();
              this.router.navigate(['/login'])
            }, 2000);
            
          },
            err => { 
              this.spinner.hide();
              console.log("error: " + err)
              Alerts.error(Mensajes.ERROR_500, Mensajes.CLINICA_NO_ELIMINADA, Mensajes.INTENTAR_MAS_TARDE);
            }
          )
          
        }, 1500);

      }
    })
 
  }

}
