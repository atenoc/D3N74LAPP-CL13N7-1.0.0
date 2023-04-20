import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { NavigateService } from 'src/app/services/navigate.service';
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
  nombreUsuario:string
  nombreCentro:string="Dental App"
  mostrarTitulo:boolean=true

  constructor(private navigateService:NavigateService, public authService: AuthService, public usuarioService: UsuarioService, private centroService:CentroService) { }

  ngOnInit() {
    console.log("NAVIGATE COMP")
    this.usuarioService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        this.correoUsuario=this.usuario.correo
        this.rolUsuario=this.usuario.rol
        this.nombreUsuario=this.usuario.nombre
        console.log("Rol Navigate: " + this.usuario.rol)

        this.centroService.getCentroByIdUser$(this.idUsuario).subscribe(
          res=>{
            if(res.nombre){
              this.nombreCentro=res.nombre
              this.mostrarTitulo=true
            }else{
              this.mostrarTitulo=false
            }
          },
          err => console.log("error: " + err)
        )
      },
      err => console.log("error: " + err)
    )
  }

  salir(){
    this.authService.logout()

    this.navigateService.mensajeActual.subscribe(
      res => {
        if(res){
          this.reload()
        }
      }
    )
  }

  reload(){
    this.rolUsuario=""
    this.nombreCentro="Dental App"
    this.ngOnInit()
    console.log("reload navigate <-")
  }

}
