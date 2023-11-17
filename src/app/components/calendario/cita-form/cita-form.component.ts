import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Mensajes } from 'src/app/shared/mensajes.config';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {

  date: Date;
  fecha_creacion:string

  fechaModelInicio: NgbDateStruct;
  fechaModelFin: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin: { hour: number, minute: number } = { hour: 0, minute: 0 };

  titulo:string=""
  motivo:string=""
  fecha_hora_inicio:string
  fecha_hora_fin:string
  nota:string=""

  mostrarMensajeTitulo:boolean = true
  mostrarMensajeMotivo:boolean = true
  mostrarMensajeFechaInicio:boolean = true
  mostrarMensajeHoraInicio:boolean = true

  //mensajes
  campoRequerido: string;
  fechaRequerida: string;
  horarioValido: string;

  constructor(private activeModal: NgbActiveModal, private citaService:CitaService) { 
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.fechaRequerida = Mensajes.FECHA_INICIO_REQUERIDA;
    this.horarioValido = Mensajes.HORARIO_INICIO_VALIDO;
  }

  ngOnInit(): void {
    console.log("CITA FORM")
    
  }

  crearCita(){
    this.date = new Date();
    console.log("Tiempo Computadora: "+ this.date)

    console.log("Fecha Inicio: "+ JSON.stringify(this.fechaModelInicio))
    console.log("Hora Inicio: "+ JSON.stringify(this.selectedTimeInicio))

    if(this.mostrarMensajeTitulo && this.mostrarMensajeMotivo && this.mostrarMensajeFechaInicio && this.mostrarMensajeHoraInicio){
      console.log("Vuelve a validar")
      this.validaTitulo()
      this.validaMotivo()
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

      const mes = this.date.getMonth() +1
      this.fecha_creacion = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
      console.log("Fecha creación:: "+this.fecha_creacion)

      const citaJson = {
        titulo: this.titulo,
        motivo: this.motivo,
        fecha_hora_inicio: this.fecha_hora_inicio,
        fecha_hora_fin: this.fecha_hora_fin,
        nota:this.nota,
        fecha_creacion: this.fecha_creacion,
        id_clinica: localStorage.getItem('_cli'),
        id_usuario: localStorage.getItem('_us')
      };

      console.log(citaJson)

      this.citaService.createCita(citaJson).subscribe(
        res=>{
        console.log("Enviado")
        console.log(res)
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

  validaMotivo(){
    if(this.motivo==""){
      this.mostrarMensajeMotivo = true
    }else{
      this.mostrarMensajeMotivo = false
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
