import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-detalle',
  templateUrl: './centro-detalle.component.html',
  styleUrls: ['./centro-detalle.component.css']
})
export class CentroDetalleComponent implements OnInit {

  @Input() idCentroModal: string;

  id: string
  centro: Centro

  constructor(
    private activatedRoute: ActivatedRoute, 
    private centroService:CentroService, 
    public modal: NgbActiveModal
    ) { }

  ngOnInit() {
    console.log("CENTRO DETALLE Comp")
    console.log("idCentroModal recibido:: "+this.idCentroModal)
    /*this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.cargarCentro(this.id)
      
    });*/

    this.cargarCentro(this.idCentroModal)
    
  }

  cargarCentro(id_centro:string){
    this.centroService.getCentro$(id_centro).subscribe(
      res => {
        this.centro = res;
        console.log("id Centro obtenido:" + res.id)
      },
      err => console.log("error: " + err)
    )
  }

  updateCentro(nombre: HTMLInputElement, telefono: HTMLInputElement, correo: HTMLInputElement, direccion: HTMLInputElement): boolean {
    this.centroService.updateCentro(this.centro.id, nombre.value, telefono.value, correo.value, direccion.value)
      .subscribe(res => {
        console.log("Centro actualizado: "+res);
        this.modal.close()

        Swal.fire({
          icon: 'success',
          html:
            `<strong>${ this.centro.nombre }</strong><br/>` +
            '¡Información actualizada!',
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 4000
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
      
      );

    return false;
  }
}
