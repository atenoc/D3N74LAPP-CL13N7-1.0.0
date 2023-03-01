import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-list',
  templateUrl: './centro-list.component.html',
  styleUrls: ['./centro-list.component.css']
})
export class CentroListComponent implements OnInit {

  centros: Centro[] = [];

  constructor(private centroService:CentroService, private router: Router) { }

  ngOnInit() {
    this.centroService.getCentros$().subscribe(
      res=>{
        console.log("Listado de centros <-> " + res)
        //console.log("Listado de centros: " + JSON.stringify(res))
        this.centros = res;
      },
     err => console.log(err)
    )
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/centro-detalle', id]);
  }

  deleteUser(id: string, nombre:string) {

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
        /*si dan clic en si, eliminar */

        this.centroService.deleteCentro(id).subscribe(res => {
          console.log("Centro eliminado:" + res)
          /* Recargamos el componente*/  
          this.ngOnInit()
          this.router.navigate(['/perfil']);
          Swal.fire({
            icon: 'success',
            showConfirmButton: false,
            text:'¡El centro dental ha sido eliminado!',
            timer: 2500
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
