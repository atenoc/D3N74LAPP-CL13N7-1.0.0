import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Diagnostico } from 'src/app/models/Diagnostico.model';
import { DiagnosticoService } from 'src/app/services/diagnosticos/diagnostico.service';
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
  diagnostico:Diagnostico;
  diagnosticos:Diagnostico[] = [];
  mensaje:string

  maxCharacters: number = 1500; // Número máximo de caracteres permitidos
  remainingCharacters: number = this.maxCharacters;

  private modalRef: NgbModalRef | undefined;

  constructor(
    private formBuilder:FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private diagnosticoService:DiagnosticoService,
    private spinner: NgxSpinnerService, 
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) { 
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_hoy = this.date.getDate()+"/"+mes+"/"+this.date.getFullYear()

    config.backdrop = 'static';
		config.keyboard = false;
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
        this.closeModal();
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

  openXl(content: TemplateRef<any>) {
		this.modalRef = this.modalService.open(content, { size: 'xl', centered: true });
    console.log('Modal abierto:', this.modalRef);
	}

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    } else {
      console.log("No hay referencia modal");
    }
  }

  updateCharacterCount(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.remainingCharacters = this.maxCharacters - input.value.length;
  }

  editar(id:string){
    this.spinner.show();
    this.diagnosticoService.getDiagnosticoById(id).subscribe(res => {   //volver a llamar los datos con el id recibido
      this.spinner.hide();
      this.diagnostico = res;
      console.log(res)

      this.formularioDiagnostico.patchValue({
        descripcion_problema: this.diagnostico.descripcion_problema,
        codigo_diagnostico: this.diagnostico.codigo_diagnostico,
        evidencias: this.diagnostico.evidencias,
        fecha_creacion: this.diagnostico.fecha_creacion

      });

    },
    err => {
      this.spinner.hide();
      console.log("error: " + err)
    })
  }

  actualizarDiagnostico(){
    console.log("Actualizar Diagnostico:")
    console.log(this.formularioDiagnostico)
    console.log("diagnostico: "+this.diagnostico.id)

    var diagnosticoJson = JSON.parse(JSON.stringify(this.formularioDiagnostico.value))
    
    this.spinner.show();
    this.diagnosticoService.updatediagnostico(this.diagnostico.id, diagnosticoJson).subscribe(res => {
        console.log("Diagnostico actualizado: "+res);
        this.closeModal();
        this.ngOnInit()
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.DIAGNOSTICO_ACTUALIZADO }</h5>`, 
            
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
          console.log("error: " + err)
          //err.error.message
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
              `<span>${ Mensajes.DIAGNOSTICO_NO_ACTUALIZADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        }
      );

    return false;
  }


  deleteDiagnostico() {

    Swal.fire({
      html:
        `<h5>${ Mensajes.DIAGNOSTICO_ELIMINAR_QUESTION }</h5> <br/> `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.diagnosticoService.deleteDiagnostico(this.diagnostico.id).subscribe(res => {
          this.spinner.hide();
          console.log("Diagnostico eliminado:" + JSON.stringify(res))

          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.DIAGNOSTICO_ELIMINADO }</h5>`,
            showConfirmButton: false,
            backdrop: false, 
            width: 400,
            background: 'rgb(40, 167, 69, .90)',
            color:'white',
            timerProgressBar:true,
            timer: 3000,
          })

          this.closeModal();
          this.ngOnInit()
        },
          err => { 
            this.spinner.hide();
            console.log("error: " + err)
            Swal.fire({
              icon: 'error',
              html:
                `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
                `<span>${ Mensajes.DIAGNOSTICO_NO_ELIMINADO}</span></br>`+
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
