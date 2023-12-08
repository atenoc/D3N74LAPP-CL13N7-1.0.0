import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CitaService } from 'src/app/services/citas/cita.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  fechaModelInicio: NgbDateStruct;
  fechaModelFin: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin: { hour: number, minute: number } = { hour: 0, minute: 0 };

  titulo:string=""
  nota:string=""
  fecha_hora_inicio:string
  fecha_hora_fin:string
  fecha_creacion:string
  date: Date;

  //mensajes
  campoRequerido: string;
  fechaRequerida: string;
  horarioValido: string;

  mostrarMensajeTitulo:boolean = true
  mostrarMensajeFechaInicio:boolean = true
  mostrarMensajeHoraInicio:boolean = true

  constructor(
    private activeModal: NgbActiveModal, 
    private citaService:CitaService,
    config: NgbDatepickerConfig
    ){ 

    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.fechaRequerida = Mensajes.FECHA_INICIO_REQUERIDA;
    this.horarioValido = Mensajes.HORARIO_INICIO_VALIDO;

    config.markDisabled = (date: NgbDateStruct) => {
      const currentDate = new Date();
      const selectedDate = new Date(date.year, date.month - 1, date.day);

      // Deshabilitar los días domingos y fechas anteriores a la actual
      return selectedDate.getDay() === 0 || selectedDate < currentDate;
    };
  }

  ngOnInit(): void {
  }

  registrarEvento(){

    if(this.mostrarMensajeTitulo && this.mostrarMensajeFechaInicio && this.mostrarMensajeHoraInicio){
      console.log("Vuelve a validar")
      this.validaTitulo()
      this.validarFechaInicio()
      this.validaHoraInicio()
    }else{

      console.log("Todo valido")
      this.fecha_hora_inicio = this.fechaModelInicio.year+"-"+this.fechaModelInicio.month+"-"+this.fechaModelInicio.day+" "+this.selectedTimeInicio.hour+":"+this.selectedTimeInicio.minute+":00"

      if(this.fechaModelFin){
        this.fecha_hora_fin = this.fechaModelFin.year+"-"+this.fechaModelFin.month+"-"+this.fechaModelFin.day+" "+this.selectedTimeFin.hour+":"+this.selectedTimeFin.minute+":"+":00"
      }else{
        this.fecha_hora_fin = null
      }

      this.date = new Date();
      const mes = this.date.getMonth() +1
      this.fecha_creacion = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
      console.log("Fecha creación:: "+this.fecha_creacion)

      var eventoJson = {
        title: this.titulo,
        start: this.fecha_hora_inicio,
        end: this.fecha_hora_fin,
        nota: this.nota,
        fecha_creacion: this.fecha_creacion,
        id_clinica: localStorage.getItem('_cli'),
        id_usuario: localStorage.getItem('_us')
      };
  
      console.log(eventoJson)
  
      this.citaService.createEvento(eventoJson).subscribe(
        res=>{
          console.log("Cita Enviada")
          console.log(res)
          this.citaService.emitirNuevaCita(); // Emitir el evento de nueva cita
  
          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.EVENTO_REGISTRADO }</h5>`+
              `<span>${ res.title }</span>`, 
            showConfirmButton: false,
            backdrop: false,
            width: 400,
            background: 'rgb(40, 167, 69, .90)',
            color:'white',
            timerProgressBar:true,
            timer: 3000,
          })
  
          this.closeModal()
  
        },
        err =>{
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
              `<span>${ Mensajes.EVENTO_NO_REGISTRADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        })
    }
 
  }

  validaTitulo(){
    if(this.titulo==""){
      this.mostrarMensajeTitulo = true
    }else{
      this.mostrarMensajeTitulo = false
    }
  }

  validarFechaInicio(){
    if(this.fechaModelInicio ==null){
      this.mostrarMensajeFechaInicio = true;
    }else{
      this.mostrarMensajeFechaInicio = false;
    }
  }

  validaHoraInicio(){
    if(this.selectedTimeInicio.hour <=6 || this.selectedTimeInicio.hour >=23 ){
      this.mostrarMensajeHoraInicio = true
    }else{
      this.mostrarMensajeHoraInicio = false
    }
  }

  closeModal() {
    this.activeModal.close('Modal cerrado');
  }

}