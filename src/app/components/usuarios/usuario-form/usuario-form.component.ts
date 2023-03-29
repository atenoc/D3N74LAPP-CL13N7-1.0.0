import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuario:Usuario
  formularioUsuario:FormGroup

  constructor(private formBuilder:FormBuilder, private usuarioService:UsuarioService, private modalService: NgbModal) { }

  ngOnInit() {
    this.formularioUsuario = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      llave: ['', Validators.required],
      rol: ['', Validators.required]
    })
  }

  crearUsuario(){
    console.log("Usuario a registrar: "+ JSON.stringify(this.formularioUsuario.value))
    var nuevoUsuarioJson = JSON.parse(JSON.stringify(this.formularioUsuario.value))
    nuevoUsuarioJson.id_usuario=localStorage.getItem('_us')
    this.usuarioService.createUsuario(nuevoUsuarioJson)
    .subscribe(
      res => {
        this.usuario = res;
        console.log("Usuario creado")
        this.modalService.dismissAll()
 
        Swal.fire({
          icon: 'success',
          html:
            `<strong> ${ this.usuario.correo } </strong><br/>` +
            '¡Registrado con éxito!',
          //text:`El usuario: ${ this.usuario.correo }, se registró con éxito`,
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 2000
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

  limpiarForm(){
    this.formularioUsuario.reset();
    console.log("Limpiando formulario")
  }

}
