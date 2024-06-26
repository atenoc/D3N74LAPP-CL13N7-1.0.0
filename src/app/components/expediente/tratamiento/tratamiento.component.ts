import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tratamiento } from 'src/app/models/Tratamiento.model';
import { TratamientoService } from 'src/app/services/tratamientos/tratamiento.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tratamiento',
  templateUrl: './tratamiento.component.html',
  styleUrls: ['./tratamiento.component.css']
})
export class TratamientoComponent implements OnInit {

  id: string;
  date: Date;
  fecha_hoy:string
  fecha_hora_actual:string;
  formularioTratamiento:FormGroup;
  existenTratamientos:boolean=false
  tratamiento:Tratamiento;
  tratamientos:Tratamiento[] = [];
  mensaje:string
  mostrar_actualizacion:boolean=false
  maxCharacters: number = 1500; // Número máximo de caracteres permitidos
  remainingCharacters: number = this.maxCharacters;
  maxCharacters2: number = 500; // Número máximo de caracteres permitidos
  remainingCharacters2: number = this.maxCharacters2;
  nombre_usuario_creador:string
  nombre_usuario_actualizo:string
  fecha_creacion:string
  fecha_actualizacion:string

  private modalRef: NgbModalRef | undefined;

  constructor(
    private formBuilder:FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private tratamientoService:TratamientoService,
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

    this.formularioTratamiento = this.formBuilder.group({
      tratamiento_propuesto: [''],
      medicamentos_prescritos: [''],
      costo_estimado: [''],
    })

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("id tratamiento recuperado: " +this.id)

      this.getTratamientos()

    }),
    err => console.log("error: " + err)
 
  }

  crearTratamiento(){
    console.log("CREAR Tratamiento")

    var nuevoTratamientoJson = JSON.parse(JSON.stringify(this.formularioTratamiento.value))
    nuevoTratamientoJson.id_paciente=this.id 
    nuevoTratamientoJson.id_clinica=localStorage.getItem('_cli') 
    nuevoTratamientoJson.id_usuario_creador=localStorage.getItem('_us') 
    nuevoTratamientoJson.fecha_creacion = this.obtenerFechaHoraHoy()

    console.log("Tratamiento.")
    console.log(nuevoTratamientoJson)

    this.spinner.show();
    this.tratamientoService.createTratamiento(nuevoTratamientoJson).subscribe(
      res => {
        this.spinner.hide();
        console.log("Tratamiento creado")
        this.closeModal();
        this.ngOnInit();
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.TRATAMIENTO_REGISTRADO }</h5>`, 
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
            `<span>${ Mensajes.TRATAMIENTO_NO_REGISTRADO }</span></br>`+
            `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
          showConfirmButton: false,
          timer: 3000
        })
        
      }
    )
  }

  getTratamientos(){
    console.log("get tratamientos")
    this.tratamientoService.getTratamientosByIdPaciente(this.id).subscribe(res => {
        console.log(res)
        this.tratamientos = res
        if(this.tratamientos.length <= 0){
          this.mensaje='No hay tratamientos para mostrar'
        }else{
          this.existenTratamientos = true;
        }
      },
      err => {
        this.mensaje='No se pudo obtener la información'
        console.log(err.error.message)
        console.log(err)
      });
  }

  obtenerFechaHoraHoy(){
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_hora_actual = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
    return this.fecha_hora_actual
  }

  openModalNuevo(content: TemplateRef<any>) {
    this.formularioTratamiento.reset()
		this.modalRef = this.modalService.open(content, { size: 'xl', centered: true });
    console.log('Modal abierto Nuevo:', this.modalRef);
	}

  openModalEdit(content: TemplateRef<any>) {
		this.modalRef = this.modalService.open(content, { size: 'xl', centered: true });
    console.log('Modal abierto Editar:', this.modalRef);
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

  updateCharacterCount2(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.remainingCharacters2 = this.maxCharacters2 - input.value.length;
  }

  getTratamientoEditar(id:string){
    this.spinner.show();
    this.tratamientoService.getTratamientById(id).subscribe(res => {   //volver a llamar los datos con el id recibido
      this.spinner.hide();
      this.tratamiento = res;
      console.log(res)

      this.formularioTratamiento.patchValue({
        tratamiento_propuesto: this.tratamiento.tratamiento_propuesto,
        medicamentos_prescritos: this.tratamiento.medicamentos_prescritos,
        costo_estimado: this.tratamiento.costo_estimado,
      });

      this.nombre_usuario_creador = this.tratamiento.nombre_usuario_creador
      this.fecha_creacion = this.tratamiento.fecha_creacion
      this.nombre_usuario_actualizo = this.tratamiento.nombre_usuario_actualizo
      this.fecha_actualizacion = this.tratamiento.fecha_actualizacion

      if(this.tratamiento.nombre_usuario_actualizo ==null || this.tratamiento.nombre_usuario_actualizo ==''){
        this.mostrar_actualizacion = false
      }else{
        this.mostrar_actualizacion = true
      }

    },
    err => {
      this.spinner.hide();
      console.log("error: " + err)
    })
  }

  actualizarTratamiento(){
    console.log("Actualizar Tratamiento:")
    console.log(this.formularioTratamiento)

    var tratamientoJson = JSON.parse(JSON.stringify(this.formularioTratamiento.value))
    tratamientoJson.id_usuario_actualizo=localStorage.getItem('_us') 
    tratamientoJson.fecha_actualizacion = this.obtenerFechaHoraHoy()
    
    this.spinner.show();
    this.tratamientoService.updateTratamiento(this.tratamiento.id, tratamientoJson).subscribe(res => {
        console.log("tratamiento actualizado: "+res);
        this.closeModal();
        this.ngOnInit()
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.TRATAMIENTO_ACTUALIZADO }</h5>`, 
            
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
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
              `<span>${ Mensajes.TRATAMIENTO_NO_ACTUALIZADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        }
      );

    return false;
  }


  deleteTratamiento() {
    Swal.fire({
      html:
        `<h5>${ Mensajes.TRATAMIENTO_ELIMINAR_QUESTION }</h5> <br/> `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.tratamientoService.deleteTratamient(this.tratamiento.id).subscribe(res => {
          this.spinner.hide();
          console.log("Tratamiento eliminado:" + JSON.stringify(res))

          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.TRATAMIENTO_ELIMINADO }</h5>`,
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
                `<span>${ Mensajes.TRATAMIENTO_NO_ELIMINADO}</span></br>`+
                `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
              showConfirmButton: false,
              timer: 3000
            }) 
        })
    
      }
    })

  }

}
