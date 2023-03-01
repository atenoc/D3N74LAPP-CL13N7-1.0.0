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
  
  constructor(private activatedRoute: ActivatedRoute, private usuariosService:UsuarioService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.usuariosService.getUsuario$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
        this.usuario = res;
        console.log("id obtenido:" + res.id)
      },
        err => console.log("error: " + err)
      )

    },
      err => console.log("error: " + err)
    );
  }

  updateUsuario(correo: HTMLInputElement, llave: HTMLInputElement, rol: HTMLInputElement): boolean {
    this.usuariosService.updateUsuario(this.usuario.id, correo.value, llave.value, rol.value).subscribe(res => {
        console.log("Usuario actualizado: "+res);
        this.router.navigate(['/usuarios']);
        
        Swal.fire({
          icon: 'success',
          //title: 'Usuario actualizado',
          html:
            `¡La información del usuario <strong>${ this.usuario.correo }</strong>,<br/>` +
            'ha sido actualizada!',
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 4000
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
            timer: 4000
          })
        }
      );

    return false;
  }

  regresar(){
    this.router.navigate(['/usuarios']);
  }

}
