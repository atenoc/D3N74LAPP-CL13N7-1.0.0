import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/models/Paciente.model';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
import { Mensajes } from 'src/app/shared/mensajes.config';

@Component({
  selector: 'app-paciente-detalle',
  templateUrl: './paciente-detalle.component.html',
  styleUrls: ['./paciente-detalle.component.css']
})
export class PacienteDetalleComponent implements OnInit {

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

  rol:string

  constructor(
    private formBuilder:FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private pacienteService:PacienteService, 
    private router: Router,
    private cifradoService: CifradoService

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
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
      correo: ['', Validators.compose([
        //Validators.required, 
        Validators.email
      ])],
      direccion: [''],
    })

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      this.pacienteService.getPacienteById$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
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
      },
      err => {
        console.log("error: " + err)
      })

    },
    err => console.log("error: " + err)
    );

  }

  getInputClass(controlName: string) {
    const control = this.formularioPaciente.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

}
