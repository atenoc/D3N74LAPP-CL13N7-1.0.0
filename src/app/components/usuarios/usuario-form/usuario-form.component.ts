import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
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
  idCentroUsuarioActivo:string

  constructor(private formBuilder:FormBuilder, private usuarioService:UsuarioService, private centroService:CentroService,
    private modalService: NgbModal, private el: ElementRef) { }

  ngOnInit() {
    console.log("USUARIO FORM")
    this.el.nativeElement.querySelector('input').focus();
    this.formularioUsuario = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      llave: ['', Validators.required],
      rol: ['', Validators.required],
      titulo: [''],
      nombre: ['', Validators.required],
      apellidop: ['', Validators.required],
      apellidom: [''],
      especialidad: [''],
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
    })

    this.centroService.getCentroByIdUser$(localStorage.getItem('_us')).subscribe(
      res => { 
        this.idCentroUsuarioActivo=res.id
      },
      err => console.log("error: " + err)
    )
  }

  crearUsuario(){
    console.log("CREAR USUARIO")

    var nuevoUsuarioJson = JSON.parse(JSON.stringify(this.formularioUsuario.value))
    nuevoUsuarioJson.id_usuario=localStorage.getItem('_us') 
    nuevoUsuarioJson.id_centro=this.idCentroUsuarioActivo
    console.log("ID Centro Activo: "+this.idCentroUsuarioActivo)
    //console.log("Usuario a registrar: "+ JSON.stringify(nuevoUsuarioJson))
    console.log("Usuario a registrar: "+ nuevoUsuarioJson)
    this.usuarioService.createUsuario(nuevoUsuarioJson).subscribe(
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
          timer: 1500
        })
      },
      err => {
        console.log("error: " + err.error.message)
        if(err.error.message=="200"){
          // Ya existe usuario
          this.el.nativeElement.querySelector('input').focus();
          Swal.fire({
            icon: 'warning',
            html:
              `<strong> Aviso </strong><br/>` +
              '¡Este correo ya se encuentra registrado!',
            showConfirmButton: true,
            confirmButtonColor: '#28a745',
            timer: 3000
          })
        }else{
          Swal.fire({
            icon: 'error',
            html:
              `<strong>¡${ err.error.message }!</strong>`,
            showConfirmButton: true,
            confirmButtonColor: '#28a745',
            timer: 3000
          })
        }
        
      }
    )
  }// end method

  limpiarForm(){
    this.formularioUsuario.reset();
    console.log("Limpiando formulario")
  }

}
