import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare var require: any;

@Component({
  selector: 'app-config-perfil-usuario',
  templateUrl: './config-perfil-usuario.component.html',
  styleUrls: ['./config-perfil-usuario.component.css']
})
export class ConfigPerfilUsuarioComponent implements OnInit {

  nombre:string
  apellido:string
  nombreClinica:string
  telefono:string
  direccionClinica:string

  formularioCentro:FormGroup

  constructor(
    private centroService:CentroService, 
    private router:Router,
    private usuarioService:UsuarioService,
    private sharedService:SharedService 
    ) { }

  ngOnInit(): void {
    console.log("CONFIG PERFIL U Component")
    this.noBack()
    require('../../../../assets/js/custom-wizard.js');

    this.centroService.getCentroByIdUser$(localStorage.getItem('_us')).subscribe(
      res => {
        console.log("Si existe Centro")
        this.router.navigate(['/agenda'])
      },
      err => {
        console.log("No existe Centro")
        console.log(err)
        this.router.navigate(['/configuracion/perfil/usuario'])
      }
    )
  }

  noBack(){
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function(event) {
        window.history.pushState(null, null, window.location.href);
    };
  }

  validarInfo(){
    console.log("Validando info")

    if(this.nombre ==="" || this.apellido ==="" || this.nombreClinica ==="" || this.telefono.length !=10 || this.direccionClinica ===""){
      Swal.fire({
        icon: 'warning',
        html:
          '¡Por favor, rellena todos los campos!',
        showConfirmButton: true,
        confirmButtonColor: '#28a745',
        timer: 2000
      })
      return
    }

    const centroJson = {
      id_usuario: localStorage.getItem('_us'),
      nombre: this.nombreClinica,
      telefono: this.telefono,
      direccion: this.direccionClinica,
    };

    console.log("Centro a insertar")
    console.log(centroJson)

    const usuarioJson = {
      id: localStorage.getItem('_us'),
      nombre: this.nombre,
      apellido: this.apellido
    };

    console.log("Usuario a actualizar ")
    console.log(usuarioJson)

    this.centroService.createCentro(centroJson).subscribe(
      res =>{
        console.log("Clínica registrada correctamente")

        this.usuarioService.updateUsuarioRegister(localStorage.getItem('_us'), this.nombre, this.apellido).subscribe(
          res=>{

            this.router.navigate(['/perfil'])
            Swal.fire({
              title: 'Genial',
              icon: 'success',
              html:
                'Todo listo para administrar tu consultorio dental',
              showConfirmButton: true,
              confirmButtonColor: '#28a745',
              timer: 5000
            })
            console.log("Usuario actualizado")
            this.sharedService.setNombreUsuario(this.nombre +" "+this.apellido)
            this.sharedService.setDataString(this.nombreClinica);
          },
          err =>{
            console.log("Error al actualizar el usuario")
            console.log(err)
          }
        )
  
      },
      err =>{
        Swal.fire({
          title: 'Oopss',
          icon: 'error',
          html:
            'No pudimos registrar tus datos, por favor intentalo más tarde.',
          showConfirmButton: true,
          confirmButtonColor: '#28a745',
          timer: 3000
        })
        console.log("Ocurrió un error al registrar la clínica")
        console.log(err)
      }
    )
  }

}