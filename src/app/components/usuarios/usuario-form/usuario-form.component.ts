import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  user = { }
  usuario:Usuario

  constructor(private usuarioService:UsuarioService, private router: Router) { }

  ngOnInit() {
  }

  crearUsuario(){
    console.log("Usuario a registrar: "+ JSON.stringify(this.user))
    var nuevoUsuarioJson = JSON.parse(JSON.stringify(this.user))
    nuevoUsuarioJson.id_usuario=localStorage.getItem('id_us')
    this.usuarioService.createUsuario(nuevoUsuarioJson)
    .subscribe(
      res => {
        //console.log("Usuario creado: "+JSON.stringify(res))
        this.usuario=res;
        console.log("Usuario creado")
        this.router.navigate(['/usuarios'])

        Swal.fire({
          icon: 'success',
          //title: 'Usuario registrado',
          html:
            `<strong> ${ this.usuario.correo } </strong><br/>` +
            '¡Registrado con éxito!',
          //text:`El usuario: ${ this.usuario.correo }, se registró con éxito`,
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 4000
        })
      },
      err => {
        console.log("error: " + err.error.message)
        Swal.fire({
          icon: 'error',
          html:
            `<strong>¡${ err.error.message }!</strong>`,
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 4000
        })
      }
    )
  }

}
