import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Historia } from 'src/app/models/Historia.model';
import { HistoriaDentalService } from 'src/app/services/historias/historia-dental.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css']
})
export class HistoriaComponent implements OnInit {

  id: string;
  rol:string
  date: Date;
  fecha_hoy:string
  fecha_actual:string;
  //paciente:Paciente;

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
    private activatedRoute: ActivatedRoute, 
    private historiaService:HistoriaDentalService,
    private spinner: NgxSpinnerService,
  ) { 
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_hoy = this.date.getDate()+"/"+mes+"/"+this.date.getFullYear()
  }

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

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("id paciente recuperado: " +this.id)
      
      this.getHistoriaDental()

    }),
    err => console.log("error: " + err)

  }

  guardarHistoria(){
    var historiaJson = JSON.parse(JSON.stringify(this.formularioHistoria.value))
    historiaJson.id_paciente = this.id;
    historiaJson.id_usuario_creador=localStorage.getItem('_us') 
    historiaJson.id_clinica=localStorage.getItem('_cli') 
    historiaJson.fecha_creacion = this.obtenerFechaHoraHoy()

    this.spinner.show();
    this.historiaService.createHistoria(historiaJson).subscribe(res =>{
      this.spinner.hide();
      console.log("Se guardó la historia")
      this.ngOnInit();
      Alerts.success(Mensajes.HISTORIA_REGISTRADA, ``);

    }),
    err => {
      this.spinner.hide();
      console.log("error: " + err)
      Alerts.error(Mensajes.ERROR_500, Mensajes.HISTORIA_NO_REGISTRADA, Mensajes.INTENTAR_MAS_TARDE);
    }
  }

  getHistoriaDental(){

    this.historiaService.getHistoriaByIdPaciente(this.id).subscribe(res => {   
        
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

      if (error.status === 404) {
        console.log("El error es 404: No cuenta con historia")
        this.botonGuardar = true
      } else {
        console.log("error: " + error.message)
      }
    });
          
  }

  actualizarHistoria(){
    var historiaJson = JSON.parse(JSON.stringify(this.formularioHistoria.value))
    historiaJson.id_paciente = this.id;
    historiaJson.id_usuario_actualizo=localStorage.getItem('_us') 
    historiaJson.fecha_actualizacion = this.obtenerFechaHoraHoy()

    this.spinner.show();
    this.historiaService.updateHistoria(this.id_historia, historiaJson).subscribe(res =>{
      this.spinner.hide();
      console.log("Se actualizó la historia")
      this.ngOnInit();

      Alerts.success(Mensajes.HISTORIA_ACTUALIZADA, ``);
    }),
    err => {
      this.spinner.hide();
      console.log("error: " + err)
      Alerts.error(Mensajes.ERROR_500, Mensajes.HISTORIA_NO_ACTUALIZADA, Mensajes.INTENTAR_MAS_TARDE);
    } 
  }


  obtenerFechaHoraHoy(){
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_actual = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
    return this.fecha_actual
  }

}
