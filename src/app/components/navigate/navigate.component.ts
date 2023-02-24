import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {

  correoUsuario: string
  usuario:Usuario
  rol:string
  id_us:string=localStorage.getItem('id_us')

  constructor(private authService: AuthService, private router:Router, private usuarioService:UsuarioService) { }

  ngOnInit() {
    //consulta de localstorage
    this.authService.mensajeActual.subscribe(correoUsuario => this.correoUsuario = correoUsuario)

    // Se valida que exista usuario en ls, si no exitste no manda a llamar nada
    if(this.id_us!=null){
      console.log("Usuario activo en ls")

      this.usuarioService.getUsuario(this.id_us)
      .subscribe(
        res => {
          this.usuario = res;
          console.log("rol:" + this.usuario.rol)
          this.rol=this.usuario.rol
        },
        err => console.log("error: " + err)
      )

    }else{
      console.log("Usuario N0 activo en ls")
    }
 
  }

  reload(){
    this.rol=""
    this.ngOnInit()
    console.log("reload navigate <-")
  }

}
