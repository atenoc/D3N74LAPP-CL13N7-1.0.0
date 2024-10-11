import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/clinicas/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { Alerts } from 'src/app/shared/utils/alerts';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtil } from 'src/app/shared/utils/DateUtil';

@Component({
  selector: 'app-centro-detalle',
  templateUrl: './centro-detalle.component.html',
  styleUrls: ['./centro-detalle.component.css']
})
export class CentroDetalleComponent implements OnInit {

  rol:string
  id: string
  centro: Centro
  formularioCentro:FormGroup
  nombreCentro:string

  //mensajes
  campoRequerido: string;
  correoNoValido: string;
  contrasenaLongitud: string;
  telefonoLongitud: string;
  soloNumeros: string;

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private formBuilder:FormBuilder, 
    private spinner: NgxSpinnerService, 
    private activatedRoute: ActivatedRoute,
    private centroService:CentroService, 
    private sharedService:SharedService,
    private router: Router, 
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoNoValido = Mensajes.CORREO_VALIDO;
      this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
      this.soloNumeros = Mensajes.SOLO_NUMEROS;
    }

  ngOnInit() {
    console.log("CENTRO DETALLE Comp")
    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();
      if(this.rol == "sop" || this.rol == "suadmin"){
        this.formularioCentro = this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
          correo: ['', [Validators.minLength(5), // Hacer que el campo sea opcional
                  (control: AbstractControl) => { // Validación condicional del correo electrónico
                    if (control.value && control.value.trim() !== '') {
                      return this.emailValidator(control);
                    } else {
                      return null; // Si el campo está vacío, no aplicar la validación del correo electrónico
                    }
                  }]],
          direccion: ['', [Validators.required, Validators.minLength(3)]]
        })

        this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          this.centroService.getCentro$(this.id).subscribe(res =>  {  //volver a llamar los datos con el id recibido
            this.centro = res;
            console.log("Centro obtenido:" + res.id)
            console.log(this.centro)
    
            this.formularioCentro.patchValue({
              correo: this.centro.correo,
              nombre: this.centro.nombre,
              telefono: this.centro.telefono,
              direccion: this.centro.direccion
            });
            this.nombreCentro = this.centro.nombre
          },
          err => {
            console.log("error: " + err)
          })
    
        },
          err => console.log("error: " + err)
        );

      }else{
        this.router.navigate(['/pagina/404/no-encontrada'])
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

  updateCentro(): boolean {

    var updateCentroJson = JSON.parse(JSON.stringify(this.formularioCentro.value))
    updateCentroJson.id_usuario_actualizo=localStorage.getItem("_us"),
    updateCentroJson.id_clinica=localStorage.getItem("_cli"),
    updateCentroJson.fecha_actualizacion=DateUtil.getCurrentFormattedDate()

    this.spinner.show();
    this.centroService.updateCentro(this.centro.id, updateCentroJson).subscribe(res => {
        this.spinner.hide();
        console.log("Centro actualizado: "+res);
        this.sharedService.setNombreClinica(this.formularioCentro.value.nombre);
        const id = localStorage.getItem('_us');
        this.router.navigate(['/perfil/', id]);

        Alerts.success(Mensajes.CLINICA_ACTUALIZADA, `${this.centro.nombre}`);
      },
        err => {
          this.spinner.hide();
          console.log("error: " + err)
          console.log(err.error.message)
          Alerts.error(Mensajes.ERROR_500, Mensajes.CLINICA_NO_ACTUALIZADA, Mensajes.INTENTAR_MAS_TARDE);
        }
      
      );

    return false;
  }
  
}
