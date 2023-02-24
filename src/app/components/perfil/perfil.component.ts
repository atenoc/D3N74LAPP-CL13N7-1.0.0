import { Component, OnInit } from '@angular/core';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario
  centro: Centro

  constructor(private usuarioService:UsuarioService, private centroService:CentroService) { }

  ngOnInit() {

    this.usuarioService.getUsuario(localStorage.getItem('idusuario'))   
      .subscribe(
        res => {
          this.usuario = res;
          console.log("id usuario obtenido:" + res.id)
        },
        err => console.log("error: " + err)
      )

    this.centroService.getCentroByIdUser(localStorage.getItem('idusuario')) 
      .subscribe(
        res => {
          this.centro = res;
          console.log("id centro obtenido:" + res.id)
        },
        err => console.log("error: " + err)
      )

  }

}
