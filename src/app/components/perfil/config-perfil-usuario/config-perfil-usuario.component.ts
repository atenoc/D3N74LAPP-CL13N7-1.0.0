import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CentroService } from 'src/app/services/centro.service';
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

  constructor(private centroService:CentroService, private router:Router) { }

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

    if(this.nombre ==="" || this.apellido ==="" || this.nombreClinica ==="" || this.telefono.length !=10){
      Swal.fire({
        icon: 'warning',
        html:
          '¡Por favor, rellena todos los campos!',
        showConfirmButton: true,
        confirmButtonColor: '#28a745',
        timer: 2000
      })
    }
  }

}