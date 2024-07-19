import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Seguimiento } from 'src/app/models/Seguimiento.model';
import { SeguimientoService } from 'src/app/services/seguimientos/seguimiento.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {

  id: string;
  formularioSeguimiento:FormGroup;
  existenSeguimientos:boolean=false
  seguimiento:Seguimiento;
  seguimientos:Seguimiento[] = [];
  mensaje:string
  mostrar_actualizacion:boolean=false
  maxCharacters: number = 1500; // Número máximo de caracteres permitidos
  remainingCharacters: number = this.maxCharacters;
  nombre_usuario_creador:string
  nombre_usuario_actualizo:string

  fecha_no_time:string
  fecha_actual:string
  fecha_creacion:string
  fecha_actualizacion:string

  private modalRef: NgbModalRef | undefined;

  constructor(
    private formBuilder:FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private seguimientoService: SeguimientoService,
    private spinner: NgxSpinnerService, 
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
		config.keyboard = false;

    this.fecha_no_time = DateUtil.getDateNoTime()
  }

  ngOnInit(): void {

    this.formularioSeguimiento = this.formBuilder.group({
      proxima_cita: [''],
      notas_seguimiento: [''],
    })

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("id seguimiento recuperado: " +this.id)

      this.getSeguimientos()

    }),
    err => console.log("error: " + err)
 
  }

  crearSeguimiento(){
    console.log("CREAR Seguimiento")

    this.fecha_actual = DateUtil.getCurrentFormattedDate()
    var nuevoSeguimientoJson = JSON.parse(JSON.stringify(this.formularioSeguimiento.value))
    nuevoSeguimientoJson.id_paciente=this.id 
    nuevoSeguimientoJson.id_clinica=localStorage.getItem('_cli') 
    nuevoSeguimientoJson.id_usuario_creador=localStorage.getItem('_us') 
    nuevoSeguimientoJson.fecha_creacion = this.fecha_actual

    console.log("Seguimiento")
    console.log(nuevoSeguimientoJson)

    this.spinner.show();
    this.seguimientoService.createSeguimiento(nuevoSeguimientoJson).subscribe(
      res => {
        this.spinner.hide();
        console.log("Seguimiento creado")
        this.closeModal();
        this.ngOnInit();

        Alerts.success(Mensajes.SEGUIMIENTO_REGISTRADO, ``);
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err.error.message)
        Alerts.error(Mensajes.ERROR_500, Mensajes.SEGUIMIENTO_NO_REGISTRADO, Mensajes.INTENTAR_MAS_TARDE);
      }
    )
  }

  getSeguimientos(){
    console.log("get Seguimientos")
    this.seguimientoService.getSeguimientosByIdPaciente(this.id).subscribe(res => {
        console.log(res)
        this.seguimientos = res
        if(this.seguimientos.length <= 0){
          this.mensaje='No hay seguimientos para mostrar'
        }else{
          this.existenSeguimientos = true;
        }
      },
      err => {
        this.mensaje='No se pudo obtener la información'
        console.log(err.error.message)
        console.log(err)
      });
  }

  openModalNuevo(content: TemplateRef<any>) {
    this.formularioSeguimiento.reset()
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

  getSeguimientoEditar(id:string){
    this.spinner.show();
    this.seguimientoService.getSeguimiento(id).subscribe(res => {   //volver a llamar los datos con el id recibido
      this.spinner.hide();
      this.seguimiento = res;
      console.log(res)

      this.formularioSeguimiento.patchValue({
        proxima_cita: this.seguimiento.proxima_cita,
        notas_seguimiento: this.seguimiento.notas_seguimiento,
      });

      this.nombre_usuario_creador = this.seguimiento.nombre_usuario_creador
      this.fecha_creacion = this.seguimiento.fecha_creacion
      this.nombre_usuario_actualizo = this.seguimiento.nombre_usuario_actualizo
      this.fecha_actualizacion = this.seguimiento.fecha_actualizacion

      if(this.seguimiento.nombre_usuario_actualizo ==null || this.seguimiento.nombre_usuario_actualizo ==''){
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

  actualizarSeguimiento(){
    console.log("Actualizar Seguimiento:")
    console.log(this.formularioSeguimiento)

    this.fecha_actual = DateUtil.getCurrentFormattedDate()
    var seguimientoJson = JSON.parse(JSON.stringify(this.formularioSeguimiento.value))
    seguimientoJson.id_usuario_actualizo=localStorage.getItem('_us') 
    seguimientoJson.fecha_actualizacion = this.fecha_actual
    
    this.spinner.show();
    this.seguimientoService.updateSeguimiento(this.seguimiento.id, seguimientoJson).subscribe(res => {
        this.spinner.hide();
        console.log("Seguimiento actualizado: "+res);
        this.closeModal();
        this.ngOnInit()
        
        Alerts.success(Mensajes.SEGUIMIENTO_ACTUALIZADO, ``);
      },
        err => {
          this.spinner.hide();
          console.log("error: " + err)
          Alerts.error(Mensajes.ERROR_500, Mensajes.SEGUIMIENTO_NO_ACTUALIZADO, Mensajes.INTENTAR_MAS_TARDE);
        }
      );

    return false;
  }

  deleteSeguimiento() {
    Alerts.confirmDelete(Mensajes.SEGUIMIENTO_ELIMINAR_QUESTION, ``).then((result) => {
      if (result.value) {
        // Confirm
        this.spinner.show();
        this.seguimientoService.deleteSeguimiento(this.seguimiento.id).subscribe(res => {
          this.spinner.hide();
          console.log("Seguimiento eliminado:" + JSON.stringify(res))

          Alerts.success(Mensajes.SEGUIMIENTO_ELIMINADO, ``);
          this.closeModal();
          this.ngOnInit()
        },
          err => { 
            console.log("error: " + err);
            Alerts.error(Mensajes.ERROR_500, Mensajes.SEGUIMIENTO_NO_ELIMINADO, Mensajes.INTENTAR_MAS_TARDE);
          }
        );
      }
    });
  }

}
