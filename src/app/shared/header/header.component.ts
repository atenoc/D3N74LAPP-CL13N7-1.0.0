import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mensajes } from '../mensajes.config';
import { SharedService } from 'src/app/services/shared.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario:Usuario
  idUsuario:string
  rol:string
  nombreUsuario:string
  llaveStatus:number
  nombreCentro:string
  mostrarCambiarContrasena:boolean=true
  mensajeContrasena:string 
  enlaceContrasena:string
  
  isDarkMode = false;
  menuOculto = false;

  isDisabled:boolean 
  mensajePruebaTerminada:string
  mensajeLink:string

  constructor(
    private sharedService:SharedService,
    public usuarioService: UsuarioService, 
    private centroService:CentroService,
    private router: Router,
    private renderer: Renderer2,
    private cifradoService: CifradoService,
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
        this.rol=this.usuario.rol

        if(this.usuario.llave_status == 0){
          this.mostrarCambiarContrasena=true
          this.mensajeContrasena=Mensajes.CONTRASENA_ACTUALIZAR;
          this.enlaceContrasena='Cambiar'
        }else{
          this.mostrarCambiarContrasena=false
          this.mensajeContrasena=''
          this.enlaceContrasena=''
        }

        if(this.cifradoService.getDecryptedIdPlan() == '0402PF3T'){
          this.isDisabled=true
          if(this.rol=="suadmin"){
            this.mensajePruebaTerminada = Mensajes.PRUEBA_TERMINADA
            this.mensajeLink="Ver planes"
            console.log("Prueba 30 terminada");
          }else if(this.rol=="adminn2" || this.rol=="medic" || this.rol=="caja" || this.rol=="recepcion"){
            this.mensajePruebaTerminada = Mensajes.PRUEBA_TERMINADA_USER
            this.mensajeLink=""
            console.log("Funcionalidades no disponibles para User");
          }

          
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
