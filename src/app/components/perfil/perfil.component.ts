import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig  } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

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
    private modalService: NgbModal, 
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

    //Este método debe quedar a nivel de ngOnInit
    this.centroService.currentCentroId.subscribe((respuesta) => {
      console.log("Valor idCentro: "+ respuesta);
      // Utiliza this.centroId para cargar los datos del centro
      if(respuesta === "success"){
        console.log("Reload")
        this.centroService.changeCentroId('')
        this.cargarClinicaAsociada()
      }
    });
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

  openVerticallyCentered(content) {
    this.centroService.changeCentroId(this.centro.id); // Cambia el id en el servicio
    this.modalService.open(content, { centered: true });

  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  selectedIdCentro(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/centro-detalle', id]);
  }

  deleteCentroCuenta(id: string, nombre:string) {

    Swal.fire({
      html:
        `<h5>¿Estás seguro que quieres eliminar tu cuenta?</h5>` +
        `<strong> Clínica/consultorio: ${ nombre } </strong> <br/>`+
        `<small>Si deseas eliminar tu cuenta, ten en cuenta que se también se borrará toda la información de tus usuarios, pacientes, médicos, citas, etc. Esta acción no se puede revertir.</small>`,
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
            
            Swal.fire({
              icon: 'success',
              showConfirmButton: false,
              html:
                  `<strong>Tu cuenta ha sido eliminada</strong>`,
              timer: 2000
            })
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
              Swal.fire({
                icon: 'error',
                html:
                  `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
                  `<span>${ Mensajes.CLINICA_NO_ELIMINADA }</span></br>`+
                  `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
                showConfirmButton: false,
                timer: 3000
              }) 
            }
          )
          
        }, 1500);

      }
    })
 
  }

}
