import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/clinicas/centro.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Router } from '@angular/router';
import { Alerts } from 'src/app/shared/utils/alerts';

@Component({
  selector: 'app-centro-form',
  templateUrl: './centro-form.component.html',
  styleUrls: ['./centro-form.component.css']
})
export class CentroFormComponent implements OnInit {

  //centro = { }
  rol:string
  centroRes:Centro
  formularioCentro:FormGroup

  //mensajes
  campoRequerido: string;
  correoValido: string;
  telefonoLongitud: string;
  soloNumeros: string;

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private router: Router,
    private formBuilder:FormBuilder, 
    private centroService:CentroService, 
    private modalService: NgbModal) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
      this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
      this.soloNumeros = Mensajes.SOLO_NUMEROS;
    }

  ngOnInit() {
    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();
      if(this.rol != "sop"){ 
        this.router.navigate(['/pagina/404/no-encontrada']);
      }else{
        this.formularioCentro = this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
          correo: ['', Validators.compose([
            //Validators.required, 
            this.emailValidator
          ])],
          direccion: ['', [Validators.required, Validators.minLength(10)]]
        })
      }
    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    } 
  }

  emailValidator(control) {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { emailInvalido: true };
  }

  getInputClass(controlName: string) {
    const control = this.formularioCentro.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  crearCentro(){

    var nuevoCentroJson = JSON.parse(JSON.stringify(this.formularioCentro.value))
    nuevoCentroJson.id_usuario=localStorage.getItem('_us')
    //console.log("nuevoCentroJson a registrar: "+JSON.stringify(nuevoCentroJson))

    this.centroService.createCentro(nuevoCentroJson)
    .subscribe(
      res => {
        this.centroRes = res
        console.log("Centro creado")
        this.modalService.dismissAll()

        Alerts.success(Mensajes.CLINICA_REGISTRADA, `Correo: ${ this.centroRes.nombre}`);
      },
      err => {
        console.log("error: " + err.error.message)
        Alerts.error(Mensajes.ERROR_500, Mensajes.CLINICA_NO_REGISTRADA, Mensajes.INTENTAR_MAS_TARDE);
      }
    )
  }

  limpiarForm(){
    this.formularioCentro.reset();
    console.log("Limpiando formulario")
  }

}
