import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-list',
  templateUrl: './centro-list.component.html',
  styleUrls: ['./centro-list.component.css']
})
export class CentroListComponent implements OnInit {

  rol:string
  centros: Centro[] = [];
  usuario:Usuario

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private centroService:CentroService, 
    private router: Router,
    private modalService: NgbModal, 
      config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
    }

  ngOnInit() {
    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol != "sop"){ 
        this.router.navigate(['/pagina/404/no-encontrada']);
      }else{
        this.centroService.getCentros$().subscribe(
          res=>{
            console.log("Listado de centros:: " + res)
            this.centros = res;
          },
         err => console.log(err)
        )
      }

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }

  openVerticallyCentered(content) {
		this.modalService.open(content, { centered: true });
	}

  selectedIdUser(id: string) {
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
        /* Confirm */

        this.centroService.deleteCentro(id).subscribe(res => {
          console.log("Centro eliminado:" + res)
          //this.ngOnInit()
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
