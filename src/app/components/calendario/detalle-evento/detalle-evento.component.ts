import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DetalleCita } from 'src/app/models/Cita.model';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';

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
  mostrarMedico:boolean
  mostrarBotonEditar:boolean
  mostrar_actualizacion:boolean=false

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
      this.mostrarMedico = true
      this.mostrarBotonEditar = true
      console.log("true")
    } else {
      this.mostrarPaciente = false
      this.mostrarMotivo = false
      this.mostrarMedico = false
      this.mostrarBotonEditar = false
      console.log("false")
    }

    if(this.data.nombre_usuario_actualizo ==null || this.data.nombre_usuario_actualizo ==''){
      this.mostrar_actualizacion = false
    }else{
      this.mostrar_actualizacion = true
    }
  }

  editarCita(){
    console.log("id editar: "+this.data.id)
    this.router.navigate(['/cita-edit', this.data.id]);
    this.closeModal()
  }

  atenderPaciente(id_paciente:string){
    console.log("id paciente: "+ id_paciente)
    this.closeModal()
    this.router.navigate(['/expediente/paciente', id_paciente]);
  }

  eliminarCita() {
    Alerts.confirmDelete(Mensajes.CITA_ELIMINAR_QUESTION, `${this.title}`).then((result) => {
      if (result.value) {
        // Confirm
        this.spinner.show();
        this.citaService.deleteCita(this.data.id).subscribe(res=>{
          this.spinner.hide();
          console.log("Cita eliminada")
          Alerts.success(Mensajes.CITA_ELIMINADA, `${this.title}`);
          
          this.citaService.emitirNuevaCita();
          this.closeModal()
        },
          err => { 
            this.spinner.hide();
            console.log("error: " + err);
            Alerts.error(Mensajes.ERROR_500, Mensajes.CITA_NO_ELIMINADA, Mensajes.INTENTAR_MAS_TARDE);
          }
        );
      }
    });
  }

  closeModal() {
    this.activeModal.close('Modal cerrado');
  }

}
