import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import Swal from 'sweetalert2';
import { Paciente } from 'src/app/models/Paciente.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {

  queryPacientes = '';
  queryMedicos = '';
  pacientes: Paciente[] = [];
  medicos: Usuario[] = [];
  date: Date;
  fecha_creacion:string
  fechaModelInicio: NgbDateStruct;
  fechaModelFin: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin: { hour: number, minute: number } = { hour: 0, minute: 0 };
  id_paciente:string
  nombrePaciente:string=""
  apellidoPaternoPaciente:string=""
  apellidoMaternoPaciente:string=""
  edadPaciente:string=""
  telefonoPaciente:string=""
  motivo:string=""
  fecha_hora_inicio:string
  fecha_hora_fin:string
  nota:string=""
  id_usuario_medico:string=""
  nombreMedico:string=""
  pacienteJson = {}

  mostrarTablaResultadosPacientes:boolean = false;
  mostrarTablaResultadosMedicos:boolean = false;
  mostrarAvisoPacientes:boolean = false;
  mostrarAvisoMedicos:boolean = false;
  existePaciente:boolean = false;
  isDisabled:boolean = false
  isDisabledInput:boolean = false
  compararHorarios:boolean = false
  mostrarMensajeNombre:boolean = false
  mostrarMensajeApPaterno:boolean = false
  mostrarMensajeEdad:boolean = false
  mostrarMensajeTelefono:boolean = false
  mostrarMensajeMotivo:boolean = false
  mostrarMensajeFechaInicio:boolean = false
  mostrarMensajeHoraInicio:boolean = false
  mostrarMensajeFechasInvalidas = false
  mostrarMensajeHorariosInvalidos:boolean = false
  mostrarMensajeSeleccionarMedico:boolean=false
  deshabilitarTimePickerInicio:boolean=true
  deshabilitarTimePickerFin:boolean=true

  //mensajes
  campoRequerido: string;
  fechaRequerida: string;
  horarioNoValido: string;
  soloNumeros: string;
  mensajeSeleccionarMedico: string;
  mensajeFechasInvalidas: string;
  mensajeHorariosInvalidos: string;
  mensajeBusquedaNoCoincidencias: string;
  mensajeCamposObligatorios: string;

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private spinner: NgxSpinnerService, 
    private activeModal: NgbActiveModal, 
    private pacienteService:PacienteService, 
    private usuarioService:UsuarioService, 
    private citaService:CitaService,
    private router: Router, 
    config: NgbDatepickerConfig
    ){ 
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.fechaRequerida = Mensajes.FECHA_INICIO_REQUERIDA;
    this.horarioNoValido = Mensajes.HORARIO_INICIO_NO_VALIDO;
    this.soloNumeros = Mensajes.SOLO_NUMEROS;
    this.mensajeSeleccionarMedico = Mensajes.SELECCIONA_MEDICO_ESPECIALISTA;
    this.mensajeFechasInvalidas = Mensajes.FECHAS_NO_VALIDAS;
    this.mensajeHorariosInvalidos = Mensajes.HORARIOS_NO_VALIDOS;
    this.mensajeBusquedaNoCoincidencias = Mensajes.BUSQUEDA_NO_COINCIDENCIAS;
    this.mensajeCamposObligatorios = Mensajes.CAMPOS_OBLIGATORIOS;

    config.markDisabled = (date: NgbDateStruct) => {
      const currentDate = new Date();
      const selectedDate = new Date(date.year, date.month - 1, date.day);

      // Deshabilitar los días domingos y fechas anteriores a la actual
      return selectedDate.getDay() === 0 || selectedDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    };
  }

  ngOnInit(): void {
    console.log("CITA FORM")

    if(this.authService.validarSesionActiva()){
      console.log("id_plan: " +this.cifradoService.getDecryptedIdPlan())
      if(this.cifradoService.getDecryptedIdPlan() == '0402PF3T'){
        this.isDisabled = true
        console.log("Prueba 30 terminada");
      }
    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }

  crearCita(){
    this.date = new Date();

    //console.log("Tiempo Computadora: "+ this.date)
    //console.log("Fecha Inicio: "+ JSON.stringify(this.fechaModelInicio))
    //console.log("Hora Inicio: "+ JSON.stringify(this.selectedTimeInicio))

    this.validaNombre() 
    this.validaApPaterno()
    this.validaEdad()
    this.validaTelefono()
    this.validaMotivo()
    this.validarFechaInicio()
    this.validaHoraInicio()
    this.compararFechas1()
    this.validarHorarios()
    this.validaMedico()

    if(
      this.mostrarMensajeNombre || 
      this.mostrarMensajeApPaterno || 
      this.mostrarMensajeEdad ||
      this.mostrarMensajeTelefono ||
      this.mostrarMensajeMotivo ||
      this.mostrarMensajeFechaInicio ||
      this.mostrarMensajeHoraInicio ||
      this.mostrarMensajeSeleccionarMedico ||
      this.mostrarMensajeFechasInvalidas ||
      this.mostrarMensajeHorariosInvalidos
    ){
      console.log("Vuelve a validar")
      Swal.fire({
        icon: 'warning',
        html:
          `<strong>Aviso</strong></br>`+
          `<span>${ Mensajes.CITA_CAMPOS_OBLIGATORIOS }</span></br>`,
        showConfirmButton: false,
        timer: 3000
      })

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
        this.registrarCita();
      }else{
        this.registrarPaciente()
      }
    }
  }

  registrarPaciente(){
    this.pacienteJson = {
      nombre: this.nombrePaciente,
      apellidop: this.apellidoPaternoPaciente,
      apellidom: this.apellidoMaternoPaciente,
      edad: this.edadPaciente,
      telefono: this.telefonoPaciente,
      fecha_creacion: this.fecha_creacion,
      id_clinica: localStorage.getItem('_cli'),
      id_usuario: localStorage.getItem('_us')
    };

    this.spinner.show();
    this.pacienteService.createPaciente(this.pacienteJson).subscribe(
      res=>{
      this.spinner.hide();
      this.id_paciente=res.id
      this.registrarCita()

      setTimeout(() => {
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.PACIENTE_REGISTRADO }</h5>`+
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
          `<span>${ Mensajes.PACIENTE_NO_REGISTRADO }</span></br>`+
          `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
        showConfirmButton: false,
        timer: 3000
      })
    })

  }

  registrarCita(){
    var citaJson = {
      title: "Cita · "+this.nombrePaciente+" "+this.apellidoPaternoPaciente,
      motivo: this.motivo,
      color: '#00a65a',
      start: this.fecha_hora_inicio,
      end: this.fecha_hora_fin,
      fecha_creacion: this.fecha_creacion,
      id_paciente: this.id_paciente,
      id_clinica: localStorage.getItem('_cli'),
      id_usuario: localStorage.getItem('_us')
    };

    console.log("Todoooo listo para registrar cita")
    console.log(citaJson)
    this.spinner.show();
    this.citaService.createCita(citaJson).subscribe(
      res=>{
        this.spinner.hide();
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
        this.spinner.hide();
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
    this.pacienteService.buscarPacientes(localStorage.getItem('_cli'), this.queryPacientes).subscribe(
      (res) => {
        this.pacientes = res;
        console.log(this.pacientes)
        if(this.pacientes.length > 0){
          this.mostrarTablaResultadosPacientes = true;
          this.mostrarAvisoPacientes = false;
        }else{
          this.mostrarTablaResultadosPacientes = false;
          this.mostrarAvisoPacientes = true;
        }
      },
      (error) => {
        console.error('Error al buscar pacientes: ', error);
      }
    );
  }

  seleccionarPaciente(id_seleccionado: string, nombre:string, apellidop:string, apellidom:string, edad:string, telefono:string): void {
    console.log("Id paciente seleccionado: " + id_seleccionado);

    this.mostrarTablaResultadosPacientes = false;
    this.existePaciente = true;

    this.nombrePaciente = nombre;
    this.apellidoPaternoPaciente = apellidop
    this.apellidoMaternoPaciente = apellidom
    this.edadPaciente = edad
    this.telefonoPaciente = telefono

    //this.query=nombre +" "+apellidop+" "+apellidom
    this.queryPacientes="" 
    this.id_paciente = id_seleccionado

    this.isDisabledInput=true
    this.mostrarMensajeNombre=false
    this.mostrarMensajeApPaterno=false

    this.validaEdad()
    this.validaTelefono()
  }

  buscarMedicos() {
    this.usuarioService.buscarMedicos(localStorage.getItem('_cli'), this.queryMedicos).subscribe(
      (res) => {
        this.medicos = res;
        console.log(this.medicos)
        if(this.medicos.length > 0){
          this.mostrarTablaResultadosMedicos = true;
          this.mostrarAvisoMedicos = false;
        }else{
          this.mostrarTablaResultadosMedicos = false;
          this.mostrarAvisoMedicos = true;
        }
      },
      (error) => {
        console.error('Error al buscar medicos: ', error);
      }
    );
  }

  seleccionarMedico(id_seleccionado: string, nombre:string, apellidop:string, apellidom:string, edad:string, telefono:string): void {
    this.queryMedicos=""
    this.mostrarTablaResultadosMedicos = false;
    this.nombreMedico = nombre +" "+apellidop+" "+apellidom;
    this.id_usuario_medico = id_seleccionado
    console.log("id usuario médico seleccionado: "+this.id_usuario_medico)

    this.validaMedico()
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
      this.deshabilitarTimePickerInicio = true
    }else{
      this.mostrarMensajeFechaInicio = false;
      this.deshabilitarTimePickerInicio = false
    }
  }

  validarFechaFin(){
    if(this.fechaModelFin ==null){
      this.deshabilitarTimePickerFin = true
    }else{
      this.deshabilitarTimePickerFin = false
    }
  }

  validaHoraInicio(){
    if(this.selectedTimeInicio.hour <=6 || this.selectedTimeInicio.hour >=23 ){
      this.mostrarMensajeHoraInicio = true
    }else{
      this.mostrarMensajeHoraInicio = false
    }
  }

  validaEdad(){
    if(this.edadPaciente ===null || this.edadPaciente===""){
      this.mostrarMensajeEdad = false
    }else{
      const esNumero = /^\d+$/.test(this.edadPaciente);
      if(!esNumero || this.edadPaciente.length > 3){
        this.mostrarMensajeEdad = true
      }else{
        this.mostrarMensajeEdad = false
      }
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

  closeModal() {
    this.activeModal.close('Modal cerrado');
  }

  cerrarAvisoPacientes() {
    this.mostrarAvisoPacientes = false;
  }

  cerrarAvisoMedicos() {
    this.mostrarAvisoMedicos = false;
  }

  validaMedico(){
    if(this.nombreMedico==""){
      this.mostrarMensajeSeleccionarMedico = true
    }else{
      this.mostrarMensajeSeleccionarMedico = false
    }
  }

  limpiar(){
    console.log("Limpiar")
    this.nombrePaciente=""
    this.apellidoPaternoPaciente=""
    this.apellidoMaternoPaciente="";
    this.edadPaciente=""
    this.telefonoPaciente=""
    this.motivo=""
    this.fechaModelInicio=null
    this.fechaModelFin=null
    this.selectedTimeInicio = { hour: 0, minute: 0 };
    this.selectedTimeFin = { hour: 0, minute: 0 };
    this.nombreMedico=""
    this.queryPacientes=""
    this.queryMedicos=""
    this.isDisabledInput = false
    this.deshabilitarTimePickerInicio = true
    this.deshabilitarTimePickerFin = true
  }

  compararFechas1(){
    const start = this.fechaModelInicio;
    const end = this.fechaModelFin;
    if(start !=null && end != null){
      console.log("Comparar fechas 1")
      this.compararFechasHtml(this.fechaModelFin)
    }
  }

  compararFechasHtml(eventFin: any) {
    const start = this.fechaModelInicio;
    const end = eventFin;
    console.log("Fecha inicio: "+ JSON.stringify(start))
    console.log("Fecha fin: "+JSON.stringify(end))

    if(start !=null){
      this.mostrarMensajeFechaInicio=false;
      console.log("Comparar fechas")
      if (end.year >= start.year) {
        this.mostrarMensajeFechasInvalidas = false
        this.compararHorarios = true

        if (end.month >= start.month) {
          this.mostrarMensajeFechasInvalidas = false
          this.compararHorarios = true

          if (end.day >= start.day) {
            this.mostrarMensajeFechasInvalidas = false
            this.compararHorarios = true
          }else{
            this.mostrarMensajeFechasInvalidas = true
          }
        } else{
          this.mostrarMensajeFechasInvalidas = true
        }
      } else{
        this.mostrarMensajeFechasInvalidas = true
      }
    }else{
      //console.log("Selecciona una fecha de inicio")
      this.mostrarMensajeFechaInicio = true
    }

    if(this.compararHorarios == true){
      setTimeout(() => {
        //esperar a que this.fechaModelFin se inicialice
        this.validarHorarios()
      }, 250);
    }
  }

  validarHorarios(){
    console.log("Validar horarios")
    const start = this.selectedTimeInicio;
    const end = this.selectedTimeFin;
    //console.log("this.fechaModelFin:: "+this.fechaModelFin)
    if(this.fechaModelFin != null){
      if (end.hour < start.hour) {
        this.mostrarMensajeHorariosInvalidos = true
      }else{
        this.mostrarMensajeHorariosInvalidos = false
      }
  
      if(end.hour == start.hour){
        if(end.minute <= start.minute){
          this.mostrarMensajeHorariosInvalidos = true
        }else{
          this.mostrarMensajeHorariosInvalidos = false
        }
      }
    }else{
      console.log("this.fechaModelFin No inicializado")
    }
  }
}