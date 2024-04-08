import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mensajes } from '../mensajes.config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario:Usuario
  idUsuario:string
  rolUsuario:string
  nombreUsuario:string
  llaveStatus:number
  nombreCentro:string
  mostrarCambiarContrasena:boolean=true
  mensajeContrasena:string

  isDarkMode = false;
  menuOculto = false;

  constructor(
    private sharedService:SharedService,
    public usuarioService: UsuarioService, 
    private centroService:CentroService,
    private router: Router,
    private renderer: Renderer2
    ) { }

  ngOnInit(): void {
    console.log("HEADER Component")

    this.sharedService.getCambiarContrasena().subscribe(data => {
      this.mostrarCambiarContrasena = data;
    });

    this.sharedService.getNombreClinica().subscribe(nombreCentro => {
      this.nombreCentro = nombreCentro;
    });

    this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        if(this.usuario.llave_status == 0){
          this.mostrarCambiarContrasena=true
          this.mensajeContrasena=Mensajes.CONTRASENA_ACTUALIZAR;
        }else{
          this.mostrarCambiarContrasena=false
        }

        this.centroService.getCentro$(localStorage.getItem('_cli')).subscribe(
          res=>{
            if(res.nombre){
              this.nombreCentro=res.nombre
            }
          },
          err => console.log("error: " + err)
        )
      },
      err => console.log("error: " + err)
    )
  }

  selectedIdUser(){
    this.router.navigate(['/password', this.idUsuario]);
  }


  /* Settings */

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Obtén la referencia al elemento body
    const body = document.body;

    // Agrega o elimina la clase 'dark-mode' según el estado actual
    if (this.isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
    }
  }

  toggleMenuOculto() {
    this.menuOculto = !this.menuOculto;

    // Obtén la referencia al elemento body
    const body = document.body;

    // Agrega o elimina la clase 'dark-mode' según el estado actual
    if (this.menuOculto) {
      this.renderer.addClass(body, 'sidebar-collapse');
      this.renderer.removeClass(body, 'sidebar-mini');
    } else {
      this.renderer.removeClass(body, 'sidebar-collapse');
    }
  }

}
