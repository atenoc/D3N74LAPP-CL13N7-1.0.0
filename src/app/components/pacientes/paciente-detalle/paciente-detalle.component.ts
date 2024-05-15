import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoSexo } from 'src/app/models/Catalogo.model';
import { CitaPaciente } from 'src/app/models/Cita.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { CitaService } from 'src/app/services/citas/cita.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

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
  editando: boolean = false;
  tituloCard: string;
  idUsuario:string;
  fecha_creacion:Date;
  nombre_usuario_creador:string;

  //mensajes
  campoRequerido: string;
  correoValido: string;
  telefonoLongitud: string;
  soloNumeros: string;
  soloLetras: string;

  catSexo:CatalogoSexo[] = [];
  citas:CitaPaciente[] = []

  constructor(
    private catalogoService:CatalogoService,
    private formBuilder:FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService, 
    private router: Router,
    private cifradoService: CifradoService,
    private spinner: NgxSpinnerService,
    private citasService: CitaService

  ) {
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
      this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
      this.soloNumeros = Mensajes.SOLO_NUMEROS;
      this.soloLetras = Mensajes.SOLO_LETRAS;
   }

  ngOnInit(): void {
    this.rol = this.cifradoService.getDecryptedRol();

    this.formularioPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidop: ['', [Validators.required, Validators.minLength(3)]],
      apellidom: ['', [this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
      edad: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
      sexo: [''],
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
      correo: ['', [Validators.minLength(5), // Hacer que el campo sea opcional
                  (control: AbstractControl) => { // Validación condicional del correo electrónico
                    if (control.value && control.value.trim() !== '') {
                      return this.emailValidator(control);
                    } else {
                      return null; // Si el campo está vacío, no aplicar la validación del correo electrónico
                    }
                  }]],
      direccion: [''],
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
        this.fecha_creacion=this.paciente.fecha_creacion
        this.nombre_usuario_creador = this.paciente.nombre_usuario_creador

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

        this.cargarCatSexo()
        this.cargarCitas()
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
    this.spinner.show();
    console.log("Actualizar paciente:")
    console.log(this.formularioPaciente)

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
      ).subscribe(res => {
        console.log("Paciente actualizado: "+res);

        this.editando=false
        this.ngOnInit()
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.PACIENTE_ACTUALIZADO }</h5>`+
            `<span>${ res.nombre } ${ res.apellidop }</span>`, 
            
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
              `<span>${ Mensajes.PACIENTE_NO_ACTUALIZADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        }
      );

    return false;
  }

  deletePaciente(id: string, nombre:string, apellidop:string) {

    Swal.fire({
      html:
        `<h5>${ Mensajes.USUARIO_ELIMINAR_QUESTION }</h5> <br/> ` +
        `<strong> ${nombre} ${apellidop} </strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.pacienteService.deletePaciente(id).subscribe(res => {
          this.spinner.hide();
          console.log("Paciente eliminado:" + JSON.stringify(res))

          Swal.fire({
            position: 'top-end',
            html:
              `<h5>${ Mensajes.USUARIO_ELIMINADO }</h5>`,
            showConfirmButton: false,
            backdrop: false, 
            width: 400,
            background: 'rgb(40, 167, 69, .90)',
            color:'white',
            timerProgressBar:true,
            timer: 3000,
          })

          this.router.navigate(['/pacientes']);
        },
          err => { 
            this.spinner.hide();
            console.log("error: " + err)
            Swal.fire({
              icon: 'error',
              html:
                `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
                `<span>${ Mensajes.USUARIO_NO_ELIMINADO }</span></br>`+
                `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
              showConfirmButton: false,
              timer: 3000
            }) 
          }
        )
    
      }
    })

  }

  cargarCatSexo(){
    this.catalogoService.getSexo$().subscribe(res => { 
      this.catSexo = res
      console.log("Sexo: "+res.length)
    },
    err => console.log("error: " + err)
    )
  }

  cargarCitas(){
    console.log("This id: "+this.id)

    this.citasService.getCitasByIdPaciente(this.id).subscribe (res => {
      console.log("Citas:")
      this.citas = res
      console.log(this.citas)

    },
    err => console.log("error: "+ err)
  )}

  selectedIdCita(id: string) {
    console.log("id cita seleccionado: "+id)
    this.router.navigate(['/detalle-visita', id]);
    //this.router.navigate(['/pacientes']);
  }

}
