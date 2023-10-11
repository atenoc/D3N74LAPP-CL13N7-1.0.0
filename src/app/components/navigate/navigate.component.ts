import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, NavigationEnd } from '@angular/router';
import { faUser, faHome, faUsers, faBuilding, faArrowRight, faCalendarDay, faAddressCard, faEnvelope } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {

  mostrarBotonIngresar:boolean=true
  faHome=faHome;
  faArrowRight=faArrowRight;

  constructor(
    public authService: AuthService, 
    public usuarioService: UsuarioService, 
    private router: Router
    ) { }

  ngOnInit() {
    console.log("NAVIGATE Component")

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/login')) {
          //console.log('Estoy en LoginComponent');
          this.mostrarBotonIngresar=false
        } else {
          //console.log('Estoy en otra ruta');
          this.mostrarBotonIngresar=true
        }
      }
    });
  }

  salir(){
    this.authService.logout()
  }

}
