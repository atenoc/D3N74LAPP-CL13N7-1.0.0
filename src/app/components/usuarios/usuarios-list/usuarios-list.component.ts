import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuariosService:UsuarioService, private router: Router) { }

  ngOnInit() {
    this.usuariosService.getUsuarios$().subscribe(res=>{
        console.log("Listado de usuarios <-> " + res)
        this.usuarios = res;
    },
      err => console.log(err)
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

        this.usuariosService.deleteUsuario(id).subscribe(res => {
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
