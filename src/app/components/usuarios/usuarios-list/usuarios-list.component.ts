import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario:Usuario

  constructor(private authService: AuthService, private usuarioService:UsuarioService, private router: Router) { }

  ngOnInit() {

    this.authService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        console.log("Rol Usuarios: "+this.usuario.rol)
        if(this.usuario.rol == "sop"){  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
          this.usuarioService.getUsuarios$().subscribe(res=>{
            console.log("Listado de usuarios <-> " + res)
            this.usuarios = res;
          },
            err => console.log(err)
          )
        }

        if(this.usuario.rol == "admin"){
          this.usuarioService.getUsuariosByUsuario$(this.usuario.id).subscribe(res=>{
            console.log("Listado de usuarios x Usuario <-> " + JSON.stringify( res))
            this.usuarios = res;
          },
            err => console.log(err)
          )
        }

      },
      err => console.log("error: " + err)
    )
    
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  deleteUser(id: string, correo:string) {

    Swal.fire({
      //title: `¡Eliminar Usuario!`,
      html:
        `¿ Estás seguro de eliminar el usuario: <br/> ` +
        `<strong> ${ correo } </strong> ? `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        /*si dan clic en si, eliminar */

        this.usuarioService.deleteUsuario(id).subscribe(res => {
          console.log("Usuario eliminado:" + res)
          /* Recargamos el componente*/  
          this.ngOnInit()
          this.router.navigate(['/usuarios']);
          Swal.fire({
            icon: 'success',
            //title: 'Usuario registrado',
            showConfirmButton: false,
            text:'¡El usuario ha sido eliminado!',
            timer: 2500
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
        )
    
      }
    })

  }

}
