import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {

  id: string
  usuario: Usuario
  editando: boolean = false;
  
  constructor(private activatedRoute: ActivatedRoute, private usuarioService:UsuarioService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.usuarioService.getUsuario$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
        this.usuario = res;
        console.log("id obtenido:" + res.id)
        console.log("usuario obtenido:" + JSON.stringify(res))
      },
        err => console.log("error: " + err)
      )

    },
      err => console.log("error: " + err)
    );
  }

  updateUsuario(correo: HTMLInputElement, llave: HTMLInputElement, rol: HTMLInputElement,
    titulo: HTMLInputElement, nombre: HTMLInputElement, apellidop: HTMLInputElement, apellidom: HTMLInputElement, especialidad: HTMLInputElement, telefono: HTMLInputElement): boolean {
    this.usuarioService.updateUsuario(this.usuario.id, correo.value, llave.value, rol.value, 
      titulo.value, nombre.value, apellidop.value, apellidom.value, especialidad.value, telefono.value).subscribe(res => {
        console.log("Usuario actualizado: "+res);
        //this.router.navigate(['/usuarios']);
        this.editando=false
        this.ngOnInit()
        Swal.fire({
          icon: 'success',
          //title: 'Usuario actualizado',
          html:
            `<strong>${ this.usuario.correo }</strong><br/>` +
            '¡Información actualizada!',
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
