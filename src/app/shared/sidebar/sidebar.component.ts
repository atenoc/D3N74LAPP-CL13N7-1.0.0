import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  usuario:Usuario
  idUsuario:string
  rolUsuario:string
  nombreUsuario:string

  constructor(
    private sharedService:SharedService, 
    public authService: AuthService, 
    public usuarioService: UsuarioService, 
    private router: Router) { }

  ngOnInit(): void {
    console.log("SIDEBAR Component")

    this.usuarioService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        this.rolUsuario=this.usuario.desc_rol
        this.nombreUsuario=this.usuario.nombre
      },
      err => console.log("error: " + err)
    )
  }

  selectedIdUser(){
    this.router.navigate(['/password', this.idUsuario]);
  }

  salir(){
    this.authService.logout()

    this.sharedService.mensajeActual.subscribe(
      res => {
        if(res){
          this.sharedService.notifyApp.emit();
          console.log("Voy a mandar una notificación a App Component")
          this.reload()
        }
      }
    )
  }

  reload(){
    this.rolUsuario=""
    this.ngOnInit()
    console.log("reload navigate <-")
  }
}
