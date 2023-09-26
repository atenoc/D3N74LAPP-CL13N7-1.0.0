import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CentroService } from 'src/app/services/centro.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario:Usuario
  existeCentro:boolean
  formularioDetalleUsuario:FormGroup
  existenUsuarios:boolean=false
  mensajeRegistrarCentro:string

  constructor(private usuarioService:UsuarioService, private router: Router, private centroService:CentroService,
    private modalService: NgbModal, config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
     }

  ngOnInit() {
    console.log("USUARIOS LIST COMP")
    if(localStorage.getItem('_us')){

      // Consultar si existe centro
      this.centroService.getCentroByIdUser$(localStorage.getItem('_us')).subscribe(
        res => {
          if(res.id.length > 0){
            this.existeCentro = true
          }else{
            this.existeCentro = false
          }
        },
        err => console.log("error: " + err)
      )

      this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
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
                this.existenUsuarios = this.usuarios.length > 0;
                if(!this.existenUsuarios){
                  this.mensajeRegistrarCentro='¡Registra un centro dental!'
                }
              },
                err => console.log(err)
              )
            }
    
            if(this.usuario.rol == "admin"){ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
              this.usuarioService.getUsuariosByUsuario$(this.usuario.id).subscribe(res=>{
                console.log("Listado de usuarios x Usuario <-> " + res)
                this.usuarios = res;
                this.existenUsuarios = this.usuarios.length > 0;
                if(!this.existenUsuarios){
                  this.mensajeRegistrarCentro='Para registrar y gestionar a tus usuarios, es necesario que previamente registres tu centro/consultorio dental. Por favor, dirígete a la parte superior derecha y da clic en tu nombre de usuario, después da clic en -> Mi Perfil.'
                }
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
    console.log("OPEN MODAL")
		//this.modalService.open(content, { centered: true });
    this.modalService.open(content, { size: 'lg', centered: true });
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

  irUsuarioForm(){
    this.router.navigate(['/usuario-form']);
  }

}
