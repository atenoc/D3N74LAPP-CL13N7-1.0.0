import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoSexo } from 'src/app/models/Catalogo.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css']
})
export class PacienteFormComponent implements OnInit {

  rol:string
  formularioPaciente:FormGroup;
  date: Date;
  fecha_creacion:string

  //mensajes
  campoRequerido: string;
  correoValido: string;
  telefonoLongitud: string;
  soloNumeros: string;
  soloLetras: string;

  paciente:Paciente
  catSexo:CatalogoSexo[] = [];

  isDisabled:boolean = false

  constructor(
    private authService:AuthService,
    private catalogoService:CatalogoService,
    private cifradoService: CifradoService,
    private formBuilder:FormBuilder, 
    private spinner: NgxSpinnerService, 
    private pacienteService:PacienteService, 
    private router: Router, 
    private el: ElementRef,
  ) {
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
    this.correoValido = Mensajes.CORREO_VALIDO;
    this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
    this.soloNumeros = Mensajes.SOLO_NUMEROS;
    this.soloLetras = Mensajes.SOLO_LETRAS;
  }

  ngOnInit(): void {
    console.log("PACIENTE FORM")

    if(this.authService.validarSesionActiva()){

      if(this.cifradoService.getDecryptedIdPlan() == '0402PF3T'){
        this.isDisabled = true
        console.log("Prueba 30 terminada");
      }

      this.rol = this.cifradoService.getDecryptedRol();
      this.el.nativeElement.querySelector('input').focus();
      this.formularioPaciente = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.minLength(3), this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
        apellidop: ['', [Validators.required, Validators.minLength(3), this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
        apellidom: ['', [this.validarTexto(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
        edad: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
        sexo: [''],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
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

      this.catalogoService.getSexo$().subscribe(res => { 
        this.catSexo = res
      },
      err => console.log("error: " + err))

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
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

  crearPaciente(){
    console.log("CREAR Paciente")

    var nuevoPacienteJson = JSON.parse(JSON.stringify(this.formularioPaciente.value))
    nuevoPacienteJson.id_usuario=localStorage.getItem('_us') 
    nuevoPacienteJson.id_clinica=localStorage.getItem('_cli') 
 
    this.date = new Date();
    const mes = this.date.getMonth() +1
    this.fecha_creacion = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
    console.log("Fecha creación:: "+this.fecha_creacion)

    nuevoPacienteJson.fecha_creacion = this.fecha_creacion

    console.log("Paciente a registrar: ")
    console.log(nuevoPacienteJson)

    this.spinner.show();
    this.pacienteService.createPaciente(nuevoPacienteJson).subscribe(
      res => {
        this.spinner.hide();
        this.paciente = res;
        console.log("Paciente creado")
        //this.modalService.dismissAll()
      
        this.router.navigate(['/pacientes'])
        Swal.fire({
          position: 'top-end',
          html:
            `<h5>${ Mensajes.PACIENTE_REGISTRADO }</h5>`+
            `<span>Paciente: ${this.paciente.nombre} ${this.paciente.apellidop}</span>`, 
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
        if(err.error.message=="400"){
          this.el.nativeElement.querySelector('input').focus();
          Swal.fire({
            icon: 'warning',
            html:
              `<strong> ${ Mensajes.WARNING } </strong><br/>` +
              `<span>${ Mensajes.PACIENTE_EXISTENTE }</span>`,
            showConfirmButton: false,
            timer: 2000
          })
        }else{
          Swal.fire({
            icon: 'error',
            html:
              `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
              `<span>${ Mensajes.PACIENTE_NO_REGISTRADO }</span></br>`+
              `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
            showConfirmButton: false,
            timer: 3000
          })
        }
        
      }
    )
  }// end method

  limpiarForm(){
    this.formularioPaciente.reset();
    console.log("Limpiando formulario")
  }

}
