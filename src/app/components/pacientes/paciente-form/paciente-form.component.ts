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
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { Alerts } from 'src/app/shared/utils/alerts';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
import { textValidator, textSomeSymbolsValidator, emailValidator } from '../../../shared/utils/validador';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css']
})
export class PacienteFormComponent implements OnInit {

  rol:string
  formularioPaciente:FormGroup;
  fecha_actual:string
  paciente:Paciente
  catSexo:CatalogoSexo[] = [];

  //mensajes
  campoRequerido: string;
  correoValido: string;
  telefonoLongitud: string;
  soloNumeros: string;
  soloLetras: string;
  longitudMinima: string
  caracteresNoPermitidos: string

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
    this.longitudMinima = Mensajes.LONGITUD_MINIMA;
    this.caracteresNoPermitidos = Mensajes.CARACTERES_NO_PERMITIDOS;
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
        nombre: ['', [Validators.required, Validators.minLength(3), textValidator()]],
        apellidop: ['', [Validators.required, Validators.minLength(3), textValidator()]],
        apellidom: ['', [Validators.minLength(3), textValidator()]],
        edad: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
        sexo: ['null'],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
        correo: ['', [Validators.minLength(5), // Hacer que el campo sea opcional
                  (control: AbstractControl) => { // Validación condicional del correo electrónico
                    if (control.value && control.value.trim() !== '') {
                      return emailValidator(control);
                    } else {
                      return null; // Si el campo está vacío, no aplicar la validación del correo electrónico
                    }
                  }]],
        direccion: ['',[Validators.minLength(3), textSomeSymbolsValidator()]],
      })

      this.catalogoService.getSexo$().subscribe(res => { 
        this.catSexo = res
      },
      err => console.log("error: " + err))

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }
  
  getInputClass(controlName: string) {
    const control = this.formularioPaciente.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  crearPaciente(){
    console.log("CREAR Paciente")

    this.fecha_actual = DateUtil.getCurrentFormattedDate()
    var nuevoPacienteJson = JSON.parse(JSON.stringify(this.formularioPaciente))
      
    nuevoPacienteJson.id_usuario_creador=localStorage.getItem('_us') 
    nuevoPacienteJson.id_clinica=localStorage.getItem('_cli') 
    nuevoPacienteJson.fecha_creacion = this.fecha_actual

    console.log("Paciente a registrar: ")
    console.log(nuevoPacienteJson)

    this.spinner.show();
    this.pacienteService.createPaciente(nuevoPacienteJson).subscribe(
      res => {
        this.spinner.hide();
        this.paciente = res;
        console.log("Paciente creado")
        this.router.navigate(['/pacientes'])
        Alerts.success(Mensajes.PACIENTE_REGISTRADO, `Correo: ${this.paciente.nombre} ${this.paciente.apellidop }`);
      },
      err => {
        this.spinner.hide();
        console.log("error: " + err.error.message)
        if(err.error.message=="400"){
          this.el.nativeElement.querySelector('input').focus();
          Alerts.warning(Mensajes.WARNING, Mensajes.PACIENTE_EXISTENTE);
        }else{
          Alerts.error(Mensajes.ERROR_500, Mensajes.PACIENTE_NO_REGISTRADO, Mensajes.INTENTAR_MAS_TARDE);
        }
        
      }
    )
  }

  limpiarForm(){
    this.formularioPaciente.reset();
    console.log("Limpiando formulario")
  }

}
