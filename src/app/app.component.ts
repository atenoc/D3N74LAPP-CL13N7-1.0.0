import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { SharedService } from './services/shared.service';
import { Usuario } from './models/Usuario.model';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  //title = 'dentalapp-client';
  isOnline: boolean;

  usuario:Usuario
  usuarioActivo:Boolean

  constructor(
    private authService:AuthService,
    public sharedService: SharedService,
    public usuarioService: UsuarioService,
    private renderer: Renderer2, 
    private el: ElementRef,
    private router:Router
    ) {
      this.isOnline = window.navigator.onLine;
     }

  ngOnInit():void{
    console.log("App Component")

    // validar conexión a internet
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // validar usuario activo
    /*this.usuarioService.validarUsuarioActivo$(localStorage.getItem('_us'), localStorage.getItem('_em')).subscribe(
      res => {
        this.usuario = res;
        if(this.usuario){
          console.log("SESION ACTIVA")
          this.usuarioActivo=true
        }
      },
      err => {
        console.log("error AppComponent: " + err)
        this.router.navigate(['/pagina/404/no-encontrada'])
      }
    )*/

    if(this.authService.validarSesionActiva()){
      console.log("SESION ACTIVA")
      this.usuarioActivo=true

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }

    //Recibir mensaje de cierre de sesión
    this.sharedService.notifyApp.subscribe(() => {
      setTimeout(() => {
        //window.location.reload();
        console.log("Recibi notificación de inicio de sesion")
      }, 1500);
    });
  }

  // ocultar mensaje online
  /*hideDiv() {
    const divElement = this.el.nativeElement.querySelector('#divMessageOnline');
    if (divElement) {
      this.renderer.setStyle(divElement, 'display', 'none');
    }
  }*/

}
