import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import Swal from 'sweetalert2';
import { Paciente } from 'src/app/models/Paciente.model';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {

  query = '';
  mostrarTablaResultados = false;

  pacientes: Paciente[] = [];

  date: Date;
  fecha_creacion:string

  fechaModelInicio: NgbDateStruct;
  fechaModelFin: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin: { hour: number, minute: number } = { hour: 0, minute: 0 };

  nombrePaciente:string=""
  apellidoPaternoPaciente:string=""
  apellidoMaternoPaciente:string=""
  edad:number=0
  titulo:string=""
  motivo:string=""
  fecha_hora_inicio:string
  fecha_hora_fin:string
  nota:string=""

  id_paciente:string

  mostrarMensajeNombre:boolean = true
  mostrarMensajeApPaterno:boolean = true
  mostrarMensajeTitulo:boolean = true
  mostrarMensajeMotivo:boolean = true
  mostrarMensajeFechaInicio:boolean = true
  mostrarMensajeHoraInicio:boolean = true

  //mensajes
  campoRequerido: string;
  fechaRequerida: string;
  horarioValido: string;

  pacienteJson = {}
  //citaJson = {}
  existePaciente:boolean;

  constructor(
    private activeModal: NgbActiveModal, 
    private pacienteService:PacienteService, 
    private citaService:CitaService
    ){ 
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

      if(this.existePaciente){
        // registrar cita

        this.registrarCita();

      }else{
        // registrar paciente y cita

        this.registrarPaciente()

      }
    }
  }

  registrarPaciente(){
    this.pacienteJson = {
      nombre: this.nombrePaciente,
      apellidop: this.apellidoPaternoPaciente,
      apellidom: this.apellidoMaternoPaciente,
      edad: this.edad,
      fecha_creacion: this.fecha_creacion,
      id_clinica: localStorage.getItem('_cli'),
      id_usuario: localStorage.getItem('_us')
    };

    this.pacienteService.createPaciente(this.pacienteJson).subscribe(
      res=>{
      this.id_paciente=res.id
      this.registrarCita()
    },
    err =>{
      Swal.fire({
        icon: 'error',
        html:
          `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
          `<span>${ Mensajes.PACIENTE_NO_REGISTRADO }</span></br>`+
          `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
        showConfirmButton: false,
        timer: 3000
      })
    })

  }

  registrarCita(){
    var citaJson = {
      title: "Cita: "+this.nombrePaciente+" "+this.apellidoMaternoPaciente,
      motivo: this.motivo,
      start: this.fecha_hora_inicio,
      end: this.fecha_hora_fin,
      fecha_creacion: this.fecha_creacion,
      id_paciente: this.id_paciente,
      id_clinica: localStorage.getItem('_cli'),
      id_usuario: localStorage.getItem('_us')
    };

    console.log(citaJson)

    this.citaService.createCita(citaJson).subscribe(
      res=>{
        console.log("Cita Enviada")
        console.log(res)
        this.citaService.emitirNuevaCita(); // Emitir el evento de nueva cita

        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.CITA_REGISTRADA }</h5>`+
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
            `<span>${ Mensajes.CITA_NO_REGISTRADA }</span></br>`+
            `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
          showConfirmButton: false,
          timer: 3000
        })
      })
  }

  buscarPacientes() {
    this.pacienteService.buscarPacientes(localStorage.getItem('_cli'), this.query).subscribe(
      (res) => {
        this.pacientes = res;
        console.log(this.pacientes)
        if(this.pacientes.length > 0){
          this.mostrarTablaResultados = true;
        }else{
          this.mostrarTablaResultados = false;
        }
      },
      (error) => {
        console.error('Error al buscar pacientes: ', error);
      }
    );
  }

  seleccionarPaciente(id_seleccionado: string, nombre:string, apellidop:string, apellidom:string): void {
    console.log("Id seleccionado: " + id_seleccionado);
    
    this.mostrarTablaResultados = false;
    this.existePaciente = true;

    this.nombrePaciente = nombre;
    this.apellidoPaternoPaciente = apellidop
    this.apellidoMaternoPaciente = apellidom

    this.query=nombre +" "+apellidop+" "+apellidom 
    this.id_paciente = id_seleccionado
   
    this.validaNombre()
    this.validaApPaterno()
  }

  validaNombre(){
    if(this.nombrePaciente==""){
      this.mostrarMensajeNombre = true
    }else{
      this.mostrarMensajeNombre = false
    }
  }

  validaApPaterno(){
    if(this.apellidoPaternoPaciente==""){
      this.mostrarMensajeApPaterno = true
    }else{
      this.mostrarMensajeApPaterno = false
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