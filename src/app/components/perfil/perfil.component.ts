import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario
  centro: Centro
  existeCentro:boolean

  constructor(private usuarioService:UsuarioService, private centroService:CentroService, private router:Router,
    private modalService: NgbModal, config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
    }

  ngOnInit() {
    if(localStorage.getItem('_us')){

      // Consulta de Usuario por Correo
      this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
        res => {
          this.usuario = res;
          // Consulta Centro del usuario
          this.centroService.getCentroByIdUser$(this.usuario.id).subscribe(
            res => {
              this.centro = res;
              if(this.centro.id.length > 0){
                this.existeCentro = true
              }else{
                this.existeCentro = false
              }
              console.log("Existe centro: "+this.existeCentro)
            },
            err => console.log("error: " + err)
          )
          
          // Suscribirse al Subject del centro recién creado
          this.centroService.getCentroCreado$.subscribe(
            res => {
              // Actualizar el valor del centro
              this.centro = res;
            },
            err => console.log("error: " + err)
          );

        },
        err => console.log("error: " + err)
      )  

    }  
  }

  openVerticallyCentered(content) {
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
        `¿ Estás seguro de eliminar el centro dental: <br/> ` +
        `<strong> ${ nombre } </strong> ? `,
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
            text:'¡El centro dental ha sido eliminado!',
            timer: 1500
          })
        },
          err => { 
            console.log("error: " + err)
            Swal.fire({
              icon: 'error',
              html:
                `<strong>¡${ err.error.message }!</strong>`,
              showConfirmButton: true,
              confirmButtonColor: '#28a745',
              timer: 4000
            }) 
          }
        )
    
      }
    })
 
  }

}
