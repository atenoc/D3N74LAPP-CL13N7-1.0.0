import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoSexo } from 'src/app/models/Catalogo.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { textValidator, textAddressValidator, emailValidator } from '../../../shared/utils/validador';

@Component({
  selector: 'app-paciente-detalle',
  templateUrl: './paciente-detalle.component.html',
  styleUrls: ['./paciente-detalle.component.css']
})
export class PacienteDetalleComponent implements OnInit {

  rol:string
  id: string;
  paciente:Paciente;
  formularioPaciente:FormGroup;
  catSexo:CatalogoSexo[] = [];
  editando: boolean = false;
  tituloCard: string;
  idUsuario:string;
  nombre_usuario_creador:string;

  //mensajes
  campoRequerido: string;
  correoValido: string;
  telefonoLongitud: string;
  soloNumeros: string;
  soloLetras: string;
  longitudMinima: string
  caracteresNoPermitidos: string

  mostrar_actualizacion:boolean=false
  nombre_usuario_actualizo:string
  fecha_creacion:string;
  fecha_actual:string
  fecha_actualizacion:string

  constructor(
    private catalogoService:CatalogoService,
    private formBuilder:FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService, 
    private router: Router,
    private cifradoService: CifradoService,
    private spinner: NgxSpinnerService,

  ) {
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.correoValido = Mensajes.CORREO_VALIDO;
    this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
    this.soloNumeros = Mensajes.SOLO_NUMEROS;
    this.soloLetras = Mensajes.SOLO_LETRAS;
    this.longitudMinima = Mensajes.LONGITUD_MINIMA;
    this.caracteresNoPermitidos = Mensajes.CARACTERES_NO_PERMITIDOS;
   }

  ngOnInit(): void {
    this.rol = this.cifradoService.getDecryptedRol();

    this.formularioPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), textValidator()]],
      apellidop: ['', [Validators.required, Validators.minLength(3), textValidator()]],
      apellidom: ['', [this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/), textValidator()]],
      edad: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
      sexo: [{value:'null', disabled: !this.editando}],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
      correo: ['', [Validators.minLength(5), // Hacer que el campo sea opcional
                  (control: AbstractControl) => { // Validación condicional del correo electrónico
                    if (control.value && control.value.trim() !== '') {
                      return this.emailValidator(control);
                    } else {
                      return null; // Si el campo está vacío, no aplicar la validación del correo electrónico
                    }
                  }]],
      direccion: ['',[Validators.minLength(3), textAddressValidator()]],
    })

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      this.spinner.show();
      this.pacienteService.getPacienteById$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
        this.spinner.hide();
        this.paciente = res;
        console.log(res)

        this.tituloCard = this.paciente.nombre+' '+this.paciente.apellidop+' '+this.paciente.apellidom
        this.idUsuario=this.paciente.id    
        this.nombre_usuario_creador = this.paciente.nombre_usuario_creador
        this.fecha_creacion=this.paciente.fecha_creacion
        this.nombre_usuario_actualizo = this.paciente.nombre_usuario_actualizo
        this.fecha_actualizacion = this.paciente.fecha_actualizacion
        console.log("this.paciente.id_sexo: "+this.paciente.id_sexo)
        this.formularioPaciente.patchValue({
          nombre: this.paciente.nombre,
          apellidop: this.paciente.apellidop,
          apellidom: this.paciente.apellidom,
          edad: this.paciente.edad,
          sexo: this.paciente.id_sexo,
          telefono: this.paciente.telefono,
          correo: this.paciente.correo,
          direccion: this.paciente.direccion,
        });

        if(this.paciente.nombre_usuario_actualizo ==null || this.paciente.nombre_usuario_actualizo ==''){
          this.mostrar_actualizacion = false
        }else{
          this.mostrar_actualizacion = true
        }

        this.cargarCatSexo()
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err)
      })

    },
    err => console.log("error: " + err)
    );

  }

  validarTexto(regex: RegExp) {
    return (control: AbstractControl) => {
      const value = control.value;
  
      if (value && !regex.test(value)) {
        return { 'invalidRegex': true };
      }
  
      return null;
    };
  }

  emailValidator(control) {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { emailInvalido: true };
  }

  getInputClass(controlName: string) {
    const control = this.formularioPaciente.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  actualizarPaciente(){
    console.log("Actualizar paciente:")
    console.log(this.formularioPaciente)

    this.fecha_actual = DateUtil.getCurrentFormattedDate()

    this.spinner.show();
    this.pacienteService.updatePaciente(
      this.paciente.id, 
      this.formularioPaciente.value.nombre,
      this.formularioPaciente.value.apellidop,
      this.formularioPaciente.value.apellidom,
      this.formularioPaciente.value.edad,
      this.formularioPaciente.value.sexo,
      this.formularioPaciente.value.telefono,
      this.formularioPaciente.value.correo,
      this.formularioPaciente.value.direccion,
      localStorage.getItem("_us"),
      this.fecha_actual
      ).subscribe(res => {
        this.spinner.hide();
        this.paciente=res
        console.log("Paciente actualizado: "+this.paciente);
        this.editando=false
        this.ngOnInit()

        Alerts.success(Mensajes.PACIENTE_ACTUALIZADO, `${this.paciente.nombre} ${this.paciente.apellidop} ${this.paciente.apellidom}`);
      },
        err => {
          this.spinner.hide();
          console.log("error: " + err)
          Alerts.error(Mensajes.ERROR_500, Mensajes.PACIENTE_NO_ACTUALIZADO, Mensajes.INTENTAR_MAS_TARDE);
        }
      );

    return false;
  }

  deletePaciente(id: string) {
    Alerts.confirmDelete(Mensajes.PACIENTE_ELIMINAR_QUESTION, `${this.paciente.nombre} ${this.paciente.apellidop} ${this.paciente.apellidom}`).then((result) => {
      if (result.value) {
        // Confirm
        this.spinner.show();
        this.pacienteService.deletePaciente(id).subscribe(res => {
          this.spinner.hide();
          console.log("Paciente eliminado:" + JSON.stringify(res))
          Alerts.success(Mensajes.PACIENTE_ELIMINADO, `${this.paciente.nombre} ${this.paciente.apellidop} ${this.paciente.apellidom}`);
          this.router.navigate(['/pacientes']);
        },
          err => { 
            console.log("error: " + err);
            Alerts.error(Mensajes.ERROR_500, Mensajes.PACIENTE_NO_ELIMINADO, Mensajes.INTENTAR_MAS_TARDE);
          }
        );
      }
    });
  }

  cargarCatSexo(){
    this.catalogoService.getSexo$().subscribe(res => { 
      this.catSexo = res
      console.log("Sexo: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }


  cambiarEstadoEditando() {
    this.editando = !this.editando;
    console.log("valor editando:: "+this.editando)
    if (this.editando) {
      this.formularioPaciente.get('sexo').enable();
    } else {
      this.formularioPaciente.get('sexo').disable();
    }
  }

}
