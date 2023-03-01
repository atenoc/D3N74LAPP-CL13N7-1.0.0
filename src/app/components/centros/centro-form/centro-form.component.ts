import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-form',
  templateUrl: './centro-form.component.html',
  styleUrls: ['./centro-form.component.css']
})
export class CentroFormComponent implements OnInit {

  centro = { }
  centroRes:Centro

  constructor(private centroService:CentroService, private router: Router) { }

  ngOnInit() {
  }

  crearCentro(){

    var nuevoCentroJson = JSON.parse(JSON.stringify(this.centro))
    nuevoCentroJson.id_usuario=localStorage.getItem('id_us')
    console.log("nuevoCentroJson a registrar: "+JSON.stringify(nuevoCentroJson))

    this.centroService.createCentro(nuevoCentroJson)
    .subscribe(
      res => {
        this.centroRes = res
        console.log("Centro creado")
        this.router.navigate(['/perfil'])

        Swal.fire({
          icon: 'success',
          html:
            `¡<strong>${ this.centroRes.nombre }</strong><br/>` +
            'se registró con éxito!',
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 4000
        })

      },
      err => {
        console.log("error: " + err.error.message)
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

}
