import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Diagnostico } from 'src/app/models/Diagnostico.model';
import { DiagnosticoService } from 'src/app/services/diagnosticos/diagnostico.service';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { textSomeSymbolsValidator} from '../../../shared/utils/validador';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css']
})
export class DiagnosticoComponent implements OnInit {

  id: string;
  formularioDiagnostico:FormGroup;
  diagnostico:Diagnostico;
  diagnosticos:Diagnostico[] = [];
  mensaje:string

  existenDiagnosticos:boolean=false
  mostrar_actualizacion:boolean=false
  maxCharacters: number = 1500; // Número máximo de caracteres permitidos
  remainingCharacters: number = this.maxCharacters;
  nombre_usuario_creador:string
  nombre_usuario_actualizo:string

  fecha_no_time:string
  //fecha_actual:string
  fecha_creacion:string
  fecha_actualizacion:string

  //mensajes
  campoRequerido: string;
  caracteresNoPermitidos: string

  private modalRef: NgbModalRef | undefined;

  constructor(
    private formBuilder:FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private diagnosticoService:DiagnosticoService,
    private spinner: NgxSpinnerService, 
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) { 
    config.backdrop = 'static';
		config.keyboard = false;

    this.fecha_no_time = DateUtil.getDateNoTime()
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.caracteresNoPermitidos = Mensajes.CARACTERES_NO_PERMITIDOS;
  }

  ngOnInit(): void {

    this.formularioDiagnostico = this.formBuilder.group({
      descripcion_problema: ['',[Validators.required, textSomeSymbolsValidator()]],
      codigo_diagnostico: ['',[Validators.required, textSomeSymbolsValidator()]],
      evidencias: [''],
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

    //this.fecha_actual = DateUtil.getCurrentFormattedDate()

    var nuevoDiagnosticoJson = JSON.parse(JSON.stringify(this.formularioDiagnostico.value))
    nuevoDiagnosticoJson.id_paciente=this.id 
    console.log("Diagnostico.")
    console.log(nuevoDiagnosticoJson)

    this.spinner.show();
    this.diagnosticoService.createDiagnostico(nuevoDiagnosticoJson).subscribe(
      res => {
        this.spinner.hide();
        console.log("Diagnostico creado")
        console.log("res: "+JSON.stringify(res))
        console.log("res id: "+res.id)
        console.log("res id_paciente: "+res.id_paciente)
        //this.closeModal();
        this.ngOnInit()
        Alerts.success(Mensajes.DIAGNOSTICO_REGISTRADO, ``);
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err.error.message)
        Alerts.error(Mensajes.ERROR_500, Mensajes.DIAGNOSTICO_NO_REGISTRADO, Mensajes.INTENTAR_MAS_TARDE);
        
      }
    )
  }

  getDiagnosticos(){
    this.diagnosticoService.getDiagnosticosByIpPaciente(this.id).subscribe(res => {
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
      });
  }

  openModalNuevo(content: TemplateRef<any>) {
    this.formularioDiagnostico.reset()
		this.modalRef = this.modalService.open(content, { size: 'xl', centered: true });
    //this.modalRef = this.modalService.open(content, { fullscreen: true });
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

  getDiagnosticoEditar(id:string){
    this.spinner.show();
    this.diagnosticoService.getDiagnosticoById(id).subscribe(res => {   //volver a llamar los datos con el id recibido
      this.spinner.hide();
      this.diagnostico = res;
      console.log(res)

      this.formularioDiagnostico.patchValue({
        descripcion_problema: this.diagnostico.descripcion_problema,
        codigo_diagnostico: this.diagnostico.codigo_diagnostico,
        evidencias: this.diagnostico.evidencias,
      });

      this.nombre_usuario_creador = this.diagnostico.nombre_usuario_creador
      this.fecha_creacion = this.diagnostico.fecha_creacion
      this.nombre_usuario_actualizo = this.diagnostico.nombre_usuario_actualizo
      this.fecha_actualizacion = this.diagnostico.fecha_actualizacion

      if(this.diagnostico.nombre_usuario_actualizo ==null || this.diagnostico.nombre_usuario_actualizo ==''){
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

  actualizarDiagnostico(){
    console.log("Actualizar Diagnostico:")
    console.log(this.formularioDiagnostico)
    
    this.spinner.show();
    this.diagnosticoService.updateDiagnostico(this.diagnostico.id, this.formularioDiagnostico.value).subscribe(res => {
        this.spinner.hide();
        console.log("Diagnostico actualizado: "+res);
        this.closeModal();
        this.ngOnInit()
        
        Alerts.success(Mensajes.DIAGNOSTICO_ACTUALIZADO, ``);
      },
        err => {
          this.spinner.hide();
          console.log("error: " + err)

          Alerts.error(Mensajes.ERROR_500, Mensajes.DIAGNOSTICO_NO_ACTUALIZADO, Mensajes.INTENTAR_MAS_TARDE);
        }
      );

    return false;
  }

  deleteDiagnostico() {
    Alerts.confirmDelete(Mensajes.DIAGNOSTICO_ELIMINAR_QUESTION, ``).then((result) => {
      if (result.value) {
        // Confirm
        this.spinner.show();
        this.diagnosticoService.deleteDiagnostico(this.diagnostico.id).subscribe(res => {
          this.spinner.hide();
          console.log("Diagnostico eliminado:" + JSON.stringify(res))

          Alerts.success(Mensajes.DIAGNOSTICO_ELIMINADO, ``);
          this.closeModal();
          this.ngOnInit()
        },
          err => { 
            console.log("error: " + err);
            Alerts.error(Mensajes.ERROR_500, Mensajes.DIAGNOSTICO_NO_ELIMINADO, Mensajes.INTENTAR_MAS_TARDE);
          }
        );
      }
    });
  }

}
