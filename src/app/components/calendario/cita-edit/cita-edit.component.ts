import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Cita, CitaEditar } from 'src/app/models/Cita.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { CitaService } from 'src/app/services/citas/cita.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { Mensajes } from 'src/app/shared/mensajes.config';

@Component({
  selector: 'app-cita-edit',
  templateUrl: './cita-edit.component.html',
  styleUrls: ['./cita-edit.component.css']
})
export class CitaEditComponent implements OnInit {

  id: string;

  query = '';
  mostrarTablaResultados = false;

  pacientes: Paciente[] = [];

  //cita:Cita
  citaEditar:CitaEditar

  date: Date;
  fecha_creacion:string

  fechaModelInicio: NgbDateStruct;
  fechaModelFin: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin: { hour: number, minute: number } = { hour: 0, minute: 0 };

  nombrePaciente:string=""
  apellidoPaternoPaciente:string=""
  apellidoMaternoPaciente:string=""
  edad:string=""
  telefonoPaciente:string=""
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
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService, 
    private citaService:CitaService,
    private ngbDateParserFormatter: NgbDateParserFormatter
    ) {
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.fechaRequerida = Mensajes.FECHA_INICIO_REQUERIDA;
    this.horarioValido = Mensajes.HORARIO_INICIO_VALIDO;
    }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        console.log(this.id)
    
        
      });

      this.citaService.getCitaById$(this.id).subscribe(res => {
        console.log("Cita a Editar:", res);
      
        this.citaEditar = res;
        //console.log(this.citaEditar);

        this.nombrePaciente = this.citaEditar.nombre
        this.apellidoPaternoPaciente = this.citaEditar.apellidop
        this.apellidoMaternoPaciente = this.citaEditar.apellidom
        this.motivo = this.citaEditar.motivo

        //this.fechaModelInicio = { year: 1789, month: 7, day: 14 };
        const fechaInicioCita: NgbDateStruct = this.ngbDateParserFormatter.parse(this.citaEditar.start);
        this.fechaModelInicio = fechaInicioCita

        console.log("Start: "+this.citaEditar.start)
        const [fecha, horaStar] = this.citaEditar.start.split(' ');
        const [hourStart, minuteStart, second] = horaStar.split(':');
        this.selectedTimeInicio = { hour: +hourStart, minute: +minuteStart };

        if(this.citaEditar.end){
          
          const fechaFinCita: NgbDateStruct = this.ngbDateParserFormatter.parse(this.citaEditar.end);
          this.fechaModelFin = fechaFinCita
          console.log("End: "+this.citaEditar.end)
          const [fechaEnd, horaEnd] = this.citaEditar.end.split(' ');
          const [hourEnd, minuteEnd, secondEnd] = horaEnd.split(':');
          this.selectedTimeFin = { hour: +hourEnd, minute: +minuteEnd };
        }

        this.validaNombre()
        this.validaApPaterno()
        this.validaMotivo()
        this.validarFechaInicio()
        this.validaHoraInicio()


      }, err => console.log("error: " + err));
      
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

}
