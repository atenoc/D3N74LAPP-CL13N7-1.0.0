import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-form',
  templateUrl: './centro-form.component.html',
  styleUrls: ['./centro-form.component.css']
})
export class CentroFormComponent implements OnInit {

  //centro = { }
  centroRes:Centro
  formularioCentro:FormGroup

  constructor(private formBuilder:FormBuilder, private centroService:CentroService, private modalService: NgbModal) { }

  ngOnInit() {
    this.formularioCentro = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
      correo: ['', Validators.compose([
        //Validators.required, 
        Validators.email
      ])],
      direccion: ['', Validators.required]
    })
  }

  crearCentro(){

    var nuevoCentroJson = JSON.parse(JSON.stringify(this.formularioCentro.value))
    nuevoCentroJson.id_usuario=localStorage.getItem('_us')
    //console.log("nuevoCentroJson a registrar: "+JSON.stringify(nuevoCentroJson))

    this.centroService.createCentro(nuevoCentroJson)
    .subscribe(
      res => {
        this.centroRes = res
        console.log("Centro creado")
        this.modalService.dismissAll()

        Swal.fire({
          icon: 'success',
          html:
            `<strong>${ this.centroRes.nombre }</strong><br/>` +
            '¡Registrado con éxito!',
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 1500
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

  limpiarForm(){
    this.formularioCentro.reset();
    console.log("Limpiando formulario")
  }

}
