import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario:Usuario

  formularioDetalleUsuario:FormGroup

  constructor(private usuarioService:UsuarioService, private router: Router,
    private modalService: NgbModal, config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
     }

  ngOnInit() {
    if(localStorage.getItem('correo_us')){

      this.usuarioService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
        res => {
  
          this.usuario = res;
          console.log("Rol Usuarios: "+this.usuario.rol)
  
          if(this.usuario.rol != "sop" && this.usuario.rol != "admin"){ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
            this.router.navigate(['/agenda']);
          }else{
  
            if(this.usuario.rol == "sop"){  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
              this.usuarioService.getUsuarios$().subscribe(res=>{
                console.log("Listado de usuarios:: " + res)
                this.usuarios = res;
              },
                err => console.log(err)
              )
            }
    
            if(this.usuario.rol == "admin"){ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
              this.usuarioService.getUsuariosByUsuario$(this.usuario.id).subscribe(res=>{
                console.log("Listado de usuarios x Usuario <-> " + res)
                this.usuarios = res;
              },
                err => console.log(err)
              )
            }
  
          }
  
        },
        err => console.log("error: " + err)
      )

    }
  }

  openVerticallyCentered(content) {
		this.modalService.open(content, { centered: true });
	}

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  deleteUser(id: string, correo:string) {

    Swal.fire({
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
        // Confirm
        this.usuarioService.deleteUsuario(id).subscribe(res => {
          console.log("Usuario eliminado:" + JSON.stringify(res))

          Swal.fire({
            icon: 'success',
            showConfirmButton: false,
            text:'¡El usuario ha sido eliminado!',
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
              timer: 4000
            }) 
          }
        )
    
      }
    })

  }

}
