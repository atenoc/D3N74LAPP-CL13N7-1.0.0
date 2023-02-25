import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {

  usuario:Usuario
  idUsuario:string
  correoUsuario: string
  rolUsuario:string

  constructor(private authService: AuthService, private router:Router, private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.authService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        this.correoUsuario=this.usuario.correo
        this.rolUsuario=this.usuario.rol
        console.log("rol:" + this.usuario.rol)
      },
      err => console.log("error: " + err)
    )

    //consulta de localstorage
    //this.authService.mensajeActual.subscribe(correoUsuario => this.correoUsuario = correoUsuario)
    
  }

  reload(){
    this.rolUsuario=""
    this.ngOnInit()
    console.log("reload navigate <-")
  }

}
