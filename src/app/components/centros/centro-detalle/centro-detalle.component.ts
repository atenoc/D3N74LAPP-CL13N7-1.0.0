import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-detalle',
  templateUrl: './centro-detalle.component.html',
  styleUrls: ['./centro-detalle.component.css']
})
export class CentroDetalleComponent implements OnInit {

  id: string
  centro: Centro

  constructor(private activatedRoute: ActivatedRoute, private centroService:CentroService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      //console.log("id obtenido: " + this.id)
      this.centroService.getCentro$(this.id)   //volver a llamar los datos con el id recibido
      .subscribe(
        res => {
          this.centro = res;
          console.log("id Centro obtenido:" + res.id)
        },
        err => console.log("error: " + err)
      )

    });
  }

  updateCentro(nombre: HTMLInputElement, telefono: HTMLInputElement, correo: HTMLInputElement, direccion: HTMLInputElement): boolean {
    this.centroService.updateCentro(this.centro.id, nombre.value, telefono.value, correo.value, direccion.value)
      .subscribe(res => {
        console.log("Centro actualizado: "+res);
        this.router.navigate(['/perfil']);

        Swal.fire({
          icon: 'success',
          html:
            `¡La información del <strong>${ this.centro.nombre }</strong>,<br/>` +
            'ha sido actualizada!',
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

  regresar(){
    this.router.navigate(['/perfil']);
  }

}
