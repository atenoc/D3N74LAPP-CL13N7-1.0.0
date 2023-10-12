import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CentroService } from 'src/app/services/centro.service';

@Component({
  selector: 'app-config-perfil-usuario',
  templateUrl: './config-perfil-usuario.component.html',
  styleUrls: ['./config-perfil-usuario.component.css']
})
export class ConfigPerfilUsuarioComponent implements OnInit {

  constructor(private centroService:CentroService, private router:Router) { }

  ngOnInit(): void {
    console.log("CONFIG PERFIL U Component")
    this.noBack()

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
}