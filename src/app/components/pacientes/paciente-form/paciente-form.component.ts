import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoSexo } from 'src/app/models/Catalogo.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { CatalogoService } from 'src/app/services/catalogo.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
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

  paciente:Paciente

  catSexo:CatalogoSexo[] = [];

  constructor(
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
  }

  ngOnInit(): void {
    this.rol = this.cifradoService.getDecryptedRol();

    this.formularioPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidop: ['', [Validators.required, Validators.minLength(3)]],
      apellidom: [''],
      edad: [''],
      sexo: [''],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
      correo: ['', Validators.compose([
        //Validators.required, 
        Validators.email
      ])],
      direccion: [''],
    })

    this.catalogoService.getSexo$().subscribe(res => { 
      this.catSexo = res
      //console.log("Especialidades: "+this.catEspecialidades.length)
    },
    err => console.log("error: " + err)
  )
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
