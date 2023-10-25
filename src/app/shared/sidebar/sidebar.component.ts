import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as $ from 'jquery';

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
    this.inicializarAccordion()

    this.usuarioService.validarUsuarioActivo$(localStorage.getItem('_us'), localStorage.getItem('_em')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        this.rolUsuario=this.usuario.rol
        this.nombreUsuario=this.usuario.nombre +" "+this.usuario.apellidop
        console.log("Usuario sidebar:: ")
        console.log(this.usuario)
      },
      err => console.log("error: " + err)
    )

    this.sharedService.getNombreUsuario().subscribe(datoRecibido => {
      this.nombreUsuario = datoRecibido;
    });
  }

  selectedIdUser(){
    this.router.navigate(['/password', this.idUsuario]);
  }

  salir(){
    this.authService.logout()

    this.sharedService.mensajeActual.subscribe(
      res => {
        if(res){
          this.rolUsuario=""
          this.sharedService.notifyApp.emit();
          console.log("Voy a mandar una notificación a App Component")

        }
      }
    )
  }

  inicializarAccordion(): void {
    $(function() {
      var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;
    
        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown);
      };
    
      Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
        var $this = $(this),
          $next = $this.next();
    
        // Personaliza la velocidad de la animación aquí (ejemplo: 200 milisegundos)
        var animationSpeed = 200;
    
        $next.slideToggle(animationSpeed);
        $this.parent().toggleClass('open');
    
        if (!e.data.multiple) {
          $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        }
      };
    
      var accordion = new Accordion($('#accordion'), false);
    });
  }
}
