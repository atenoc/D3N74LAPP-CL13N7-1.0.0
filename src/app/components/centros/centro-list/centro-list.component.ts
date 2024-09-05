import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/clinicas/centro.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtil } from 'src/app/shared/utils/DateUtil';

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
    private spinner: NgxSpinnerService, 
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
    Alerts.confirmDelete(Mensajes.CLINICA_ELIMINAR_QUESTION, nombre).then((result) => {
      if (result.value) {
        // Confirm
        const deleteClinicaJson = {
          id_usuario_elimino:localStorage.getItem("_us"),
          id_clinica:localStorage.getItem("_cli"),
          fecha_eliminacion:DateUtil.getCurrentFormattedDate()
        }

        this.spinner.show();
        this.centroService.deleteCentro(id, deleteClinicaJson).subscribe(res => {
          this.spinner.hide();
          console.log("Clinica eliminada:" + res)

          Alerts.success(Mensajes.CLINICA_ELIMINADA, nombre);
        },
          err => { 
            this.spinner.hide();
            console.log("error: " + err);
            Alerts.error(Mensajes.ERROR_500, Mensajes.CLINICA_NO_ELIMINADA, Mensajes.INTENTAR_MAS_TARDE);
          }
        );
      }
    });
  }

}
