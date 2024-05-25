import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Diagnostico } from 'src/app/models/Diagnostico.model';
import { DiagnosticoService } from 'src/app/services/diagnosticos/diagnostico.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css']
})
export class DiagnosticoComponent implements OnInit {

  id: string;
  date: Date;
  fecha_hoy:string
  fecha_hora_actual:string;
  formularioDiagnostico:FormGroup;
  existenDiagnosticos:boolean=false
  diagnosticos:Diagnostico[] = [];
  mensaje:string

  constructor(
    private formBuilder:FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private diagnosticoService:DiagnosticoService,
    private spinner: NgxSpinnerService, 
  ) { 
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_hoy = this.date.getDate()+"/"+mes+"/"+this.date.getFullYear()
  }

  ngOnInit(): void {

    this.formularioDiagnostico = this.formBuilder.group({
      descripcion_problema: [''],
      codigo_diagnostico: [''],
      evidencias: [''],
      fecha_creacion: [this.fecha_hoy],
    })

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("id paciente recuperado: " +this.id)

      this.getDiagnosticos()

    }),
    err => console.log("error: " + err)

    
  }

  crearDiagnostico(){
    console.log("CREAR Diagnostico")

    var nuevoDiagnosticoJson = JSON.parse(JSON.stringify(this.formularioDiagnostico.value))
    nuevoDiagnosticoJson.id_paciente=this.id 
    nuevoDiagnosticoJson.id_clinica=localStorage.getItem('_cli') 
    nuevoDiagnosticoJson.id_usuario_creador=localStorage.getItem('_us') 
    nuevoDiagnosticoJson.fecha_creacion = this.obtenerFechaHoraHoy()

    console.log("Diagnostico.")
    console.log(nuevoDiagnosticoJson)

    this.spinner.show();
    this.diagnosticoService.createDiagnostico(nuevoDiagnosticoJson).subscribe(
      res => {
        this.spinner.hide();
        console.log("Diagnostico creado")
        this.ngOnInit();
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.DIAGNOSTICO_REGISTRADO }</h5>`, 
          showConfirmButton: false,
          backdrop: false,
          width: 400,
          background: 'rgb(40, 167, 69, .90)',
          color:'white',
          timerProgressBar:true,
          timer: 3000,
        })
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err.error.message)
        Swal.fire({
          icon: 'error',
          html:
            `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
            `<span>${ Mensajes.DIAGNOSTICO_NO_REGISTRADO }</span></br>`+
            `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
          showConfirmButton: false,
          timer: 3000
        })
        
      }
    )
  }// end method

  getDiagnosticos(){
    this.diagnosticoService
      .getDiagnosticosByIpPaciente(this.id).subscribe(res => {
        console.log(res)
        this.diagnosticos = res
        if(this.diagnosticos.length <= 0){
          this.mensaje='No hay diagnósticos para mostrar'
        }else{
          this.existenDiagnosticos = true;
        }
      },
      err => {
        this.mensaje='No se pudo obtener la información'
        console.log(err.error.message)
        console.log(err)
      }
      );
  }

  obtenerFechaHoraHoy(){
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_hora_actual = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
    return this.fecha_hora_actual
  }

}
