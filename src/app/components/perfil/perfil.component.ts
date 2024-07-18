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

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario = {} as Usuario;
  centro: Centro = {} as Centro;

  rol:string
  mostrarOpciones:boolean=false

  constructor(
    private spinner: NgxSpinnerService, 
    private authService:AuthService,
    private usuarioService:UsuarioService, 
    private centroService:CentroService, 
    private router:Router,
    private cifradoService: CifradoService,
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

      // Consulta de Usuario por Correo
      this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
        res => {
          this.usuario = res;
          console.log(this.usuario )
          // Consulta Centro del usuario
          this.cargarClinicaAsociada()
        },
        err => console.log("error: " + err)
      )  

    }

  }

  cargarClinicaAsociada(){
    this.centroService.getCentro$(localStorage.getItem('_cli')).subscribe(
      res => {
        this.centro = res;
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
        this.spinner.show();
        setTimeout(() => {
          this.centroService.deleteCentro(id).subscribe(res => {
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
