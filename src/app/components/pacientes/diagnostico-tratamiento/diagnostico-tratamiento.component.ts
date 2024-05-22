import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Historia } from 'src/app/models/Historia.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { HistoriaDentalService } from 'src/app/services/historias/historia-dental.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diagnostico-tratamiento',
  templateUrl: './diagnostico-tratamiento.component.html',
  styleUrls: ['./diagnostico-tratamiento.component.css']
})
export class DiagnosticoTratamientoComponent implements OnInit {

  id: string;
  rol:string
  date: Date;
  fecha_actual:string;
  tituloPagina:string
  paciente:Paciente;

  nombre_usuario_creador:string
  nombre_usuario_actualizo:string
  fecha_creacion:string
  fecha_actualizacion:string
  mostrar_creacion:boolean=false
  mostrar_actualizacion:boolean=false
  historia:Historia
  id_historia:string
  formularioHistoria:FormGroup;
  botonGuardar:boolean=false;
  botonActualizar:boolean = false


  constructor(
    private formBuilder:FormBuilder, 
    private authService:AuthService,
    private cifradoService: CifradoService,
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService,
    private historiaService:HistoriaDentalService,
    private spinner: NgxSpinnerService, 
  ) { }

  ngOnInit(): void {

    this.formularioHistoria = this.formBuilder.group({
      ultima_visita_dentista: [''],
      problemas_dentales_pasados: [''],
      tratamientos_previos_cuando: [''],
      dolor_sensibilidad: [''],
      condicion_medica_actual: [''], 
      medicamentos_actuales: [''], 
      alergias_conocidas: [''], 
      cirugias_enfermedades_graves: [''], 
      frecuencia_cepillado: [''], 
      uso_hilo_dental: [''], 
      uso_productos_especializados: [''], 
      tabaco_frecuencia: [''], 
      habito_alimenticio: [''], 

    })

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1" || this.rol == "adminn2" || this.rol == "medic"){

        this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          this.pacienteService.getPacienteById$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
            this.paciente = res;
            this.tituloPagina = res.nombre +" "+ res.apellidop +" " +res.apellidom
          },
          err => {
            console.log("error: " + err)
          })

          this.spinner.show();
          this.historiaService.getHistoriaByIdPaciente(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
            this.spinner.hide();
            this.historia = res;
            console.log("Historia obtenida")
            this.id_historia = res.id

            this.formularioHistoria.patchValue({
              ultima_visita_dentista: this.historia.ultima_visita_dentista,
              problemas_dentales_pasados: this.historia.problemas_dentales_pasados,
              tratamientos_previos_cuando: this.historia.tratamientos_previos_cuando,
              dolor_sensibilidad: this.historia.dolor_sensibilidad,

              condicion_medica_actual: this.historia.condicion_medica_actual,
              medicamentos_actuales: this.historia.medicamentos_actuales,
              alergias_conocidas: this.historia.alergias_conocidas,
              cirugias_enfermedades_graves: this.historia.cirugias_enfermedades_graves,

              frecuencia_cepillado: this.historia.frecuencia_cepillado,
              uso_hilo_dental: this.historia.uso_hilo_dental,
              uso_productos_especializados: this.historia.uso_productos_especializados,
              tabaco_frecuencia: this.historia.tabaco_frecuencia,
              habito_alimenticio: this.historia.habito_alimenticio
            })

            this.nombre_usuario_creador = this.historia.nombre_usuario_creador
            this.fecha_creacion = this.historia.fecha_creacion
            this.nombre_usuario_actualizo = this.historia.nombre_usuario_actualizo
            this.fecha_actualizacion = this.historia.fecha_actualizacion 

            this.mostrar_creacion=true
            this.botonActualizar = true

            if(this.historia.nombre_usuario_actualizo ==null || this.historia.nombre_usuario_actualizo ==''){
              this.botonGuardar = false
            }else{
              this.mostrar_actualizacion = true
            }

          },
          (error: HttpErrorResponse) => {
            this.spinner.hide();
            if (error.status === 404) {
              console.log("El error es 404")
              this.botonGuardar = true
            } else {
              console.log("error: " + error.message)
            }
          });

        }),
        err => console.log("error: " + err)

      }
    }
  }

  guardarHistoria(){
    var historiaJson = JSON.parse(JSON.stringify(this.formularioHistoria.value))
    historiaJson.id_paciente = this.id;
    historiaJson.id_usuario_creador=localStorage.getItem('_us') 
    historiaJson.id_clinica=localStorage.getItem('_cli') 
    historiaJson.fecha_creacion = this.obtenerFechaHoy()

    this.spinner.show();
    this.historiaService.createHistoria(historiaJson).subscribe(res =>{
      this.spinner.hide();
      console.log("Se guardó la historia")
      this.ngOnInit();

      Swal.fire({
        position: 'top-end',
        html:
          `<h5>${ Mensajes.HISTORIA_REGISTRADA }</h5>`+
          `<span>${ this.paciente.nombre } ${ this.paciente.apellidop }</span>`, 
          
        showConfirmButton: false,
        backdrop: false, 
        width: 400,
        background: 'rgb(40, 167, 69, .90)',
        color:'white',
        timerProgressBar:true,
        timer: 3000,
      })

    }),
    err => {
      this.spinner.hide();
      console.log("error: " + err)

      Swal.fire({
        icon: 'error',
        html:
          `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
          `<span>${ Mensajes.HISTORIA_NO_REGISTRADA }</span></br>`+
          `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  actualizarHistoria(){
    var historiaJson = JSON.parse(JSON.stringify(this.formularioHistoria.value))
    historiaJson.id_paciente = this.id;
    historiaJson.id_usuario_actualizo=localStorage.getItem('_us') 
    historiaJson.fecha_actualizacion = this.obtenerFechaHoy()

    this.spinner.show();
    this.historiaService.updateHistoria(this.id_historia, historiaJson).subscribe(res =>{
      this.spinner.hide();
      console.log("Se actualizó la historia")
      this.ngOnInit();

      Swal.fire({
        position: 'top-end',
        html:
          `<h5>${ Mensajes.HISTORIA_ACTUALIZADA }</h5>`+
          `<span>${ this.paciente.nombre } ${ this.paciente.apellidop }</span>`, 
          
        showConfirmButton: false,
        backdrop: false, 
        width: 400,
        background: 'rgb(40, 167, 69, .90)',
        color:'white',
        timerProgressBar:true,
        timer: 3000,
      })
    }),
    err => {
      this.spinner.hide();
      console.log("error: " + err)

      Swal.fire({
        icon: 'error',
        html:
          `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
          `<span>${ Mensajes.HISTORIA_NO_ACTUALIZADA }</span></br>`+
          `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
        showConfirmButton: false,
        timer: 3000
      })
    } 

  }

  obtenerFechaHoy(){
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_actual = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
    return this.fecha_actual
  }

}
