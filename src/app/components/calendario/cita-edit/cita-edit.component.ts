import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaEditar } from 'src/app/models/Cita.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { CitaService } from 'src/app/services/citas/cita.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

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
  tituloCard: string;
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
  edadPaciente:string=""
  telefonoPaciente:string=""
  titulo:string=""
  motivo:string=""
  fecha_hora_inicio:string
  fecha_hora_fin:string
  nota:string=""

  id_paciente:string
  //id_medico:string

  mostrarMensajeNombre:boolean = true
  mostrarMensajeApPaterno:boolean = true
  mostrarMensajeTitulo:boolean = true
  mostrarMensajeMotivo:boolean = true
  mostrarMensajeFechaInicio:boolean = true
  mostrarMensajeHoraInicio:boolean = true
  mostrarMensajeTelefono:boolean = true

  //mensajes
  campoRequerido: string;
  fechaRequerida: string;
  horarioValido: string;
  soloNumeros: string;

  pacienteJson = {}
  //citaJson = {}
  existePaciente:boolean;

  constructor(
    private spinner: NgxSpinnerService, 
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService, 
    private citaService:CitaService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private router:Router,
    config: NgbDatepickerConfig
    ) {
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.fechaRequerida = Mensajes.FECHA_INICIO_REQUERIDA;
    this.horarioValido = Mensajes.HORARIO_INICIO_VALIDO;
    this.soloNumeros = "Ingresa sólo números";

    config.markDisabled = (date: NgbDateStruct) => {
      const currentDate = new Date();
      const selectedDate = new Date(date.year, date.month - 1, date.day);

      // Deshabilitar los días domingos y fechas anteriores a la actual
      return selectedDate.getDay() === 0 || selectedDate < currentDate;
    };
    }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        console.log(this.id)
      });

      this.citaService.getCitaById$(this.id).subscribe(res => {
        console.log("Cita a Editar:", res);
      
        this.citaEditar = res;
        this.tituloCard = this.citaEditar.nombre+' '+this.citaEditar.apellidop+' '+this.citaEditar.apellidom
        //console.log(this.citaEditar);

        this.motivo = this.citaEditar.motivo
        this.nombrePaciente = this.citaEditar.nombre
        this.apellidoPaternoPaciente = this.citaEditar.apellidop
        this.apellidoMaternoPaciente = this.citaEditar.apellidom
        this.edadPaciente = this.citaEditar.edad
        this.telefonoPaciente = this.citaEditar.telefono
        this.id_paciente=this.citaEditar.id_paciente

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
        this.validaTelefono()

      }, err => console.log("error: " + err));
      
    }
    
  updateCita(){
    this.spinner.show();
    this.pacienteService.updatePacienteCita(
      this.id_paciente,
      this.nombrePaciente, 
      this.apellidoPaternoPaciente,
      this.apellidoMaternoPaciente,
      this.edadPaciente,
      this.telefonoPaciente
    ).subscribe(res =>{
      this.spinner.hide();
      console.log("Se actualizó la información del paciente")
      console.log(res)

      setTimeout(() => {
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>Paciente actualizado correctamente</h5>`+
            `<span>${res.nombre} ${res.apellidop} ${res.apellidom}</span>`, 
          showConfirmButton: false,
          backdrop: false,
          width: 400,
          background: 'rgb(40, 167, 69, .90)',
          color:'white',
          timerProgressBar:true,
          timer: 3000,
        })
      }, 3000);

    },
    err =>{
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        html:
          `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
          `<span>${ Mensajes.PACIENTE_NO_ACTUALIZADO }</span></br>`+
          `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
        showConfirmButton: false,
        timer: 3000
      })
    })

    this.fecha_hora_inicio = this.fechaModelInicio.year+"-"+this.fechaModelInicio.month+"-"+this.fechaModelInicio.day+" "+this.selectedTimeInicio.hour+":"+this.selectedTimeInicio.minute+":00"

    if(this.fechaModelFin){
      this.fecha_hora_fin = this.fechaModelFin.year+"-"+this.fechaModelFin.month+"-"+this.fechaModelFin.day+" "+this.selectedTimeFin.hour+":"+this.selectedTimeFin.minute+":"+":00"
    }else{
      this.fecha_hora_fin = null
    }

    this.spinner.show();
    this.citaService.updateCita(
      this.id,
      "Cita · "+this.nombrePaciente+" "+this.apellidoPaternoPaciente,
      this.motivo,
      this.fecha_hora_inicio,
      this.fecha_hora_fin,
      this.nota,
      this.id_paciente
    ).subscribe(
      res=>{
        this.spinner.hide();
        console.log("Cita actualizada")
        console.log(res)
        this.citaService.emitirNuevaCita(); // Emitir el evento de nueva cita

        this.router.navigate(['/calendario'])

        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.CITA_ACTUALIZADA }</h5>`+
            `<span>${ res.title }</span>`, 
          showConfirmButton: false,
          backdrop: false,
          width: 400,
          background: 'rgb(40, 167, 69, .90)',
          color:'white',
          timerProgressBar:true,
          timer: 3000,
        })

      },
      err =>{
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          html:
            `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
            `<span>${ Mensajes.CITA_NO_ACTUALIZADA }</span></br>`+
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

  seleccionarPaciente(id_seleccionado: string, nombre:string, apellidop:string, apellidom:string, edad:string, telefono:string): void {
    console.log("Id seleccionado: " + id_seleccionado);
    console.log("Teléfono seleccionado: " + telefono);
    
    this.mostrarTablaResultados = false;
    this.existePaciente = true;

    this.nombrePaciente = nombre;
    this.apellidoPaternoPaciente = apellidop
    this.apellidoMaternoPaciente = apellidom
    this.edadPaciente = edad
    this.telefonoPaciente = telefono

    this.query=nombre +" "+apellidop+" "+apellidom 
    this.id_paciente = id_seleccionado
   
    this.validaNombre()
    this.validaApPaterno()
    this.validaTelefono()
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

  validaTelefono(){
    const esNumero = /^\d+$/.test(this.telefonoPaciente);
    if(!esNumero || this.telefonoPaciente.length < 10){
      this.mostrarMensajeTelefono = true
    }else{
      this.mostrarMensajeTelefono = false
    }
  }

}
