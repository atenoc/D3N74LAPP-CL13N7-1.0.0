import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.component.html',
  styleUrls: ['./contrasena.component.css']
})
export class ContrasenaComponent implements OnInit {

  formPassword:FormGroup
  id:string
  llave:string
  passwordType: string = 'password';

  //iconos
  faEye=faEye;
  faEyeSlash=faEyeSlash;

  constructor(private formBuilder:FormBuilder, private activatedRoute: ActivatedRoute, private usuarioService:UsuarioService) { }

  ngOnInit() {

    this.formPassword = this.formBuilder.group({
      nuevoPassword1: ['', [Validators.required, Validators.minLength(8)]],
      nuevoPassword2: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
    
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.usuarioService.getUsuario$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
        this.llave = res.llave;
        console.log("id obtenido:" + res.llave)

      },
        err => console.log("error: " + err)
      )

    },
      err => console.log("error: " + err)
    );
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
    this.usuarioService.updateUsuarioLlave(this.id, formGroup.get('nuevoPassword1').value).subscribe(res => {
        console.log("Contraseña actualizada: "+res);
        this.ngOnInit()
        Swal.fire({
          icon: 'success',
          //title: 'Usuario actualizado',
          html:
            //`<strong>${ this.id }</strong><br/>` +
            '¡Tu contraseña se actualizó correctamente!',
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 1500
        })

      },
        err => {
          console.log("error: " + err)
          Swal.fire({
            icon: 'error',
            html:
              `<strong>¡${ err.error.message }!</strong>`,
            showConfirmButton: true,
            confirmButtonColor: '#28a745',
            timer: 3000
          })
        }
      );

    return false;
  }

}
