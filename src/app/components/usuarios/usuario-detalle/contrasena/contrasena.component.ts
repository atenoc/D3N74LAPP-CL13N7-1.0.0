import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { Alerts } from 'src/app/shared/utils/alerts';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.component.html',
  styleUrls: ['./contrasena.component.css']
})
export class ContrasenaComponent implements OnInit {

  rol:string

  formPassword:FormGroup
  id:string
  llave:string
  passwordType: string = 'password';

  //iconos
  faEye=faEye;
  faEyeSlash=faEyeSlash;

  //mensajes
  campoRequerido: string;
  contrasenaInvalida: string;
  contrasenaLongitud: string;
  contrasenaConfirmacion: string;
  contrasenasNoCoinciden: string;

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private spinner: NgxSpinnerService,
    private router: Router, 
    private formBuilder:FormBuilder,
    private activatedRoute: ActivatedRoute, 
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.contrasenaInvalida = Mensajes.CONTRASENA_INVALIDA;
      this.contrasenaLongitud = Mensajes.CONTRASENA_LONGITUD;
      this.contrasenaConfirmacion = Mensajes.CONTRASENA_CONFIRMACION;
      this.contrasenasNoCoinciden = Mensajes.CONTRASENAS_NO_COINCIDEN;
     }

  ngOnInit() {

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1"){

        this.formPassword = this.formBuilder.group({
          nuevoPassword1: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
          nuevoPassword2: ['', [Validators.required]]
        }, {
          validator: this.passwordMatchValidator
        });
        
        this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          this.authService.getPassUsuario$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
            this.llave = res.llave;
            console.log("Res obtenido")
    
          },
            err => console.log("error: " + err)
          )
    
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

  passwordValidator(control) {
    // La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial.
    const passwordRegexp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/;
    return passwordRegexp.test(control.value) ? null : { passwordInvalido: true };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password1 = formGroup.get('nuevoPassword1').value;
    const password2 = formGroup.get('nuevoPassword2').value;
  
    if (password1 !== password2) {
      formGroup.get('nuevoPassword2').setErrors({ mismatch: true });
    } else {
      formGroup.get('nuevoPassword2').setErrors(null);
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  updateUsuarioLlave(formGroup: FormGroup): boolean {
    console.log("Actualizando contraseña...")

    this.spinner.show();
    this.authService.updateUsuarioLlave(this.id, formGroup.get('nuevoPassword1').value).subscribe(res => {
      this.spinner.hide();
        console.log("Contraseña actualizada: "+res);
        this.router.navigate(['/usuario-detalle', res.id]);

        Alerts.success(Mensajes.CONTRASENA_ACTUALIZADA, ``);
      },
        err => {
          this.spinner.hide();
          console.log("error: " + err)
          console.log(err.error.message )
          Alerts.error(Mensajes.ERROR_500, Mensajes.CONTRASENA_NO_ACTUALIZADA, Mensajes.INTENTAR_MAS_TARDE);
        }
      );

    return false;
  }

}
