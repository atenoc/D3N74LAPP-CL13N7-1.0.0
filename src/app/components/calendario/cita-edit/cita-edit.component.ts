import { compileNgModule } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaEditar } from 'src/app/models/Cita.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { CitaService } from 'src/app/services/citas/cita.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-edit',
  templateUrl: './cita-edit.component.html',
  styleUrls: ['./cita-edit.component.css']
})
export class CitaEditComponent implements OnInit {

  id: string;
  queryPacientes = '';
  queryMedicos = '';
  mostrarTablaResultadosPacientes = false;
  pacientes: Paciente[] = [];
  medicos: Usuario[] = [];
  tituloCard: string;
  citaEditar:CitaEditar

  date: Date;
  fecha_creacion:string

  fechaModelInicio: NgbDateStruct;
  fechaModelFin?: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin?: { hour: number, minute: number } = { hour: 0, minute: 0 };

  fechaModelInicioObtenido: NgbDateStruct;
  fechaModelFinObtenido?: NgbDateStruct;
  selectedTimeInicioObtenido: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFinObtenido?: { hour: number, minute: number } = { hour: 0, minute: 0 };

  nombrePaciente:string=""
  apellidoPaternoPaciente:string=""
  apellidoMaternoPaciente:string=""
  edadPaciente:string=""
  telefonoPaciente:string=""
  telefonoPacienteObtenido:string=""
  //titulo:string=""
  motivo:string=""
  motivoObtenido:string=""
  fecha_hora_inicio:string
  fecha_hora_fin:string
  nota:string=""
  id_paciente:string
  //id_medico:string

  mostrarMensajeMotivo:boolean = true
  mostrarMensajeFechaInicio:boolean = true
  mostrarMensajeHoraInicio:boolean = true
  mostrarMensajeTelefono:boolean = true
  mostrarMensajeNoExistenCambios:boolean = false

  //mensajes
  campoRequerido: string;
  fechaRequerida: string;
  horarioNoValido: string;
  soloNumeros: string;
  mensajeNoExistenCambios="No detectamos cambios para actualizar"

  pacienteJson = {}
  existePaciente:boolean;

  mostrarMensajeFechasInvalidas = false
  mostrarMensajeHorariosInvalidos:boolean = false
  mostrarMensajeSeleccionarMedico:boolean=false
  compararHorarios:boolean = false
  mostrarTablaResultadosMedicos:boolean = false;
  mostrarAvisoMedicos:boolean = false;
  mostrarAvisoPacientes:boolean = false;
  deshabilitarTimePickerInicio:boolean=true
  deshabilitarTimePickerFin:boolean=true

  mensajeFechasInvalidas: string;
  mensajeHorariosInvalidos: string;
  mensajeBusquedaNoCoincidencias: string;
  mensajeSeleccionarMedico: string;

  nombreMedico:string=""
  id_usuario_medico:string=""

  constructor(
    private spinner: NgxSpinnerService, 
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService, 
    private usuarioService:UsuarioService, 
    private citaService:CitaService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private router:Router,
    config: NgbDatepickerConfig
    ) {
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.fechaRequerida = Mensajes.FECHA_INICIO_REQUERIDA;
    this.horarioNoValido = Mensajes.HORARIO_INICIO_NO_VALIDO;
    this.soloNumeros = Mensajes.SOLO_NUMEROS;
    this.mensajeFechasInvalidas = Mensajes.FECHAS_NO_VALIDAS;
    this.mensajeHorariosInvalidos = Mensajes.HORARIOS_NO_VALIDOS;
    this.mensajeSeleccionarMedico = Mensajes.SELECCIONA_MEDICO_ESPECIALISTA;
    this.mensajeBusquedaNoCoincidencias = Mensajes.BUSQUEDA_NO_COINCIDENCIAS;

    config.markDisabled = (date: NgbDateStruct) => {
      const currentDate = new Date();
      const selectedDate = new Date(date.year, date.month - 1, date.day);

      // Deshabilitar los días domingos y fechas anteriores a la actual
      return selectedDate.getDay() === 0 || selectedDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
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
        this.motivoObtenido = this.citaEditar.motivo
        this.nombrePaciente = this.citaEditar.nombre
        this.apellidoPaternoPaciente = this.citaEditar.apellidop
        this.apellidoMaternoPaciente = this.citaEditar.apellidom
        this.edadPaciente = this.citaEditar.edad
        this.telefonoPaciente = this.citaEditar.telefono
        this.telefonoPacienteObtenido = this.citaEditar.telefono
        this.id_paciente=this.citaEditar.id_paciente

        //this.fechaModelInicio = { year: 1789, month: 7, day: 14 };
        const fechaInicioCita: NgbDateStruct = this.ngbDateParserFormatter.parse(this.citaEditar.start);
        this.fechaModelInicio = fechaInicioCita
        this.fechaModelInicioObtenido = fechaInicioCita;

        console.log("Start: "+this.citaEditar.start)
        const [fecha, horaStar] = this.citaEditar.start.split(' ');
        const [hourStart, minuteStart, second] = horaStar.split(':');
        this.selectedTimeInicio = { hour: +hourStart, minute: +minuteStart };
        this.selectedTimeInicioObtenido = { hour: +hourStart, minute: +minuteStart };

        if(this.citaEditar.end){
          
          const fechaFinCita: NgbDateStruct = this.ngbDateParserFormatter.parse(this.citaEditar.end);
          this.fechaModelFin = fechaFinCita
          this.fechaModelFinObtenido = fechaFinCita;

          console.log("End: "+this.citaEditar.end)
          const [fechaEnd, horaEnd] = this.citaEditar.end.split(' ');
          const [hourEnd, minuteEnd, secondEnd] = horaEnd.split(':');
          this.selectedTimeFin = { hour: +hourEnd, minute: +minuteEnd };
          this.selectedTimeFinObtenido = { hour: +hourEnd, minute: +minuteEnd };
        }

        this.validaMotivo()
        this.validarFechaInicio()
        this.validaHoraInicio()
        this.validaTelefono()
        this.compararFechas1()
        this.validarHorarios()
        this.validaMedico()

      }, err => console.log("error: " + err));
      
    }
  
  // Método para actualizar la cita
  compararDatos(): void {
    console.log("Compara datos")
    this.validaMotivo()
    this.validaTelefono()
    this.validaMedico()


    if(this.mostrarMensajeMotivo || this.mostrarMensajeSeleccionarMedico || this.mostrarMensajeTelefono){
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

      console.log("Motivo lleno")
      if (this.esIgualCita()) {
        this.mostrarMensajeNoExistenCambios = true
        console.log("No existen cambios Cita")
      } else {
        this.mostrarMensajeNoExistenCambios = false
        console.log("Cambios Cita")
        this.updateCita();
      }

      if (this.esIgualPaciente()) {
        this.mostrarMensajeNoExistenCambios = true
        console.log("No existen cambios Paciente")
      } else {
        this.mostrarMensajeNoExistenCambios = false
        console.log("cambios Paciente")
        this.updatePaciente() 
      }
    }  
  }

  esIgualCita(): boolean {
    const fechaInicioIgual = this.compararFecha(this.fechaModelInicio, this.fechaModelInicioObtenido);
    const fechaFinIgual = this.fechaModelFin && this.fechaModelFinObtenido
      ? this.compararFecha(this.fechaModelFin, this.fechaModelFinObtenido)
      : this.fechaModelFin === this.fechaModelFinObtenido;

    const horaInicioIgual = this.compararHora(this.selectedTimeInicio, this.selectedTimeInicioObtenido);
    const horaFinIgual = this.selectedTimeFin && this.selectedTimeFinObtenido
      ? this.compararHora(this.selectedTimeFin, this.selectedTimeFinObtenido)
      : this.selectedTimeFin === this.selectedTimeFinObtenido;

    const motivoIgual = this.motivo === this.motivoObtenido;

    return fechaInicioIgual && fechaFinIgual && horaInicioIgual && horaFinIgual && motivoIgual;
  }

  esIgualPaciente(): boolean {
    const telefonoIgual = this.telefonoPaciente === this.telefonoPacienteObtenido;
    return telefonoIgual;
  }

  // Función para comparar fechas
  compararFecha(fecha1: NgbDateStruct, fecha2: NgbDateStruct): boolean {
    return fecha1.year === fecha2.year && fecha1.month === fecha2.month && fecha1.day === fecha2.day;
  }

  // Función para comparar horas
  compararHora(hora1: { hour: number, minute: number }, hora2: { hour: number, minute: number }): boolean {
    return hora1.hour === hora2.hour && hora1.minute === hora2.minute;
  }
    
  updatePaciente(){
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

      this.router.navigate(['/calendario'])
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

  }  

  updateCita(){
    this.fecha_hora_inicio = this.fechaModelInicio.year+"-"+this.fechaModelInicio.month+"-"+this.fechaModelInicio.day+" "+this.selectedTimeInicio.hour+":"+this.selectedTimeInicio.minute+":00"
    console.log("fecha_hora_inicio a guardar: " +this.fecha_hora_inicio)

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
    console.log("Id seleccionado: " + id_seleccionado);
    console.log("Teléfono seleccionado: " + telefono);
    
    this.mostrarTablaResultadosPacientes = false;
    this.existePaciente = true;

    this.nombrePaciente = nombre;
    this.apellidoPaternoPaciente = apellidop
    this.apellidoMaternoPaciente = apellidom
    this.edadPaciente = edad
    this.telefonoPaciente = telefono

    this.queryPacientes=nombre +" "+apellidop+" "+apellidom 
    this.id_paciente = id_seleccionado
   
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

  validaTelefono(){
    const esNumero = /^\d+$/.test(this.telefonoPaciente);
    if(!esNumero || this.telefonoPaciente.length < 10){
      this.mostrarMensajeTelefono = true
    }else{
      this.mostrarMensajeTelefono = false
    }
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

  eliminarCita(){
    console.log("Eliminar cita")
    console.log("id cita: "+this.id)

    Swal.fire({
      html:
        `<h5>${ Mensajes.CITA_ELIMINAR_QUESTION }</h5>` +
        `<strong> ${this.citaEditar.nombre} ${this.citaEditar.apellidop} ${this.citaEditar.apellidom} </strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.citaService.deleteCita(this.id).subscribe(res=>{
          console.log("Cita eliminada")
          this.spinner.hide();

          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.CITA_ELIMINADA }</h5>`+
              `<span>${this.citaEditar.nombre} ${this.citaEditar.apellidop} ${this.citaEditar.apellidom}</span>`, 
            showConfirmButton: false,
            backdrop: false, 
            width: 400,
            background: 'rgb(40, 167, 69, .90)',
            color:'white',
            timerProgressBar:true,
            timer: 3000,
          })

          //this.citaService.emitirNuevaCita();
          this.router.navigate(['/calendario'])
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

}
