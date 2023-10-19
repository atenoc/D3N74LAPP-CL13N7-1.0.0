import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig  } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
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

  existeCentro:boolean

  constructor(
    private usuarioService:UsuarioService, 
    private centroService:CentroService, 
    private router:Router,
    private modalService: NgbModal, 
    config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
    }

  ngOnInit() {
    console.log("PERFIL Component")
    if(localStorage.getItem('_us')){

      // Consulta de Usuario por Correo
      this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
        res => {
          this.usuario = res;
          console.log(this.usuario )
          // Consulta Centro del usuario
          this.cargarCentroPorIdUsuario()
        },
        err => console.log("error: " + err)
      )  

    }  
    console.log("Existe Final: "+this.existeCentro)

    this.centroService.currentCentroId.subscribe((respuesta) => {
      console.log("Valor idCentro: "+ respuesta);
      // Utiliza this.centroId para cargar los datos del centro
      if(respuesta === "success"){
        console.log("Reload")
        this.centroService.changeCentroId('')
        this.cargarCentroPorIdUsuario()
      }
    });
  }

  cargarCentroPorIdUsuario(){
    this.centroService.getCentroByIdUser$(this.usuario.id).subscribe(
      res => {
        this.centro = res;
        this.existeCentro = true
        console.log("Existe centro: "+this.existeCentro)
      },
      err => {
        console.log("error: " + err)
        this.existeCentro = false
        console.log("Existe False: "+this.existeCentro)
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

  deleteCentro(id: string, nombre:string) {

    Swal.fire({
      html:
        `<h5>${ Mensajes.CLINICA_ELIMINAR_QUESTION }</h5> <br/> ` +
        `<strong> ${ nombre } </strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        // Confirm

        this.centroService.deleteCentro(id).subscribe(res => {
          console.log("Centro eliminado:" + res)
          this.ngOnInit()
          Swal.fire({
            icon: 'success',
            showConfirmButton: false,
            html:
                `<strong>${ Mensajes.CLINICA_ELIMINADA }</strong>`,
            timer: 2000
          })
        },
          err => { 
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
    
      }
    })
 
  }

}
