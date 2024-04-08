import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DetalleCita } from 'src/app/models/Cita.model';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit {

  @Input() title: string;
  @Input() inicio: string;
  @Input() fin: string;
  @Input() data: DetalleCita;

  mostrarPaciente:boolean
  mostrarMotivo:boolean
  mostrarBotonEditar:boolean

  constructor(
    private spinner: NgxSpinnerService, 
    private activeModal: NgbActiveModal,
    private citaService:CitaService, 
    private router:Router
    ) { }

  ngOnInit(): void {
    console.log("Detalle")
    console.log("title: "+ this.title+ ", incio: "+this.inicio+", fin:  "+this.fin)
    console.log(this.data)
    if(this.data.nombre_paciente){
      this.mostrarPaciente = true
      this.mostrarMotivo = true
      this.mostrarBotonEditar = true
      console.log("true")
    } else {
      this.mostrarPaciente = false
      this.mostrarMotivo = false
      this.mostrarBotonEditar = false
      console.log("false")
    }
  }

  editarCita(){
    console.log("id editar: "+this.data.id)
    this.router.navigate(['/cita-edit', this.data.id]);
    this.closeModal()
  }

  eliminarCita(){
    console.log("Eliminar cita")
    console.log("id cita: "+this.data.id)

    Swal.fire({
      html:
        `<h5>${ Mensajes.CITA_ELIMINAR_QUESTION }</h5>` +
        `<strong> ${ this.title } </strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.citaService.deleteCita(this.data.id).subscribe(res=>{
          console.log("Cita eliminada")
          this.spinner.hide();

          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.CITA_ELIMINADA }</h5>`+
              `<span>${ this.title }</span>`, 
            showConfirmButton: false,
            backdrop: false, 
            width: 400,
            background: 'rgb(40, 167, 69, .90)',
            color:'white',
            timerProgressBar:true,
            timer: 3000,
          })

          this.citaService.emitirNuevaCita();
          this.closeModal()
        },
          err => { 
            this.spinner.hide();
            console.log("error: " + err)
            Swal.fire({
              icon: 'error',
              html:
                `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
                `<span>${ Mensajes.CITA_NO_ELIMINADA }</span></br>`+
                `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
              showConfirmButton: false,
              timer: 3000
            }) 
          }
        )
    
      }
    })

  }

  closeModal() {
    this.activeModal.close('Modal cerrado');
  }

}
