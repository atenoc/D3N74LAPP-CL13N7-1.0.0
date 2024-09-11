import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import * as $ from 'jquery';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('medidor') medidor: ElementRef;
  //@ViewChild('spanUsuarios') spanUsuarios: ElementRef; //obtener el id de un elemento html

  usuario:Usuario
  idUsuario:string
  rolUsuario:string
  nombreUsuario:string
  mostrarClinicas:boolean=false;
  mostrarUsuarios:boolean=false;

  id_plan:string
  mensajeVigencia:string
  mensajeRestanDias:string
  linkPlanes:string

  constructor(
    private sharedService:SharedService, 
    public authService: AuthService, 
    private router: Router,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    console.log("SIDEBAR Component")
    //this.inicializarAccordion()

    this.authService.validarUsuarioActivo$(localStorage.getItem('_us'), localStorage.getItem('_em'), localStorage.getItem('_cli')).subscribe(
      res => {
        this.usuario = res;
        //console.log("sidebar usuario")
        //console.log(this.usuario)
        this.idUsuario=this.usuario.id
        this.rolUsuario=this.usuario.rol
        this.id_plan=this.usuario.id_plan
        console.log("U Plan: "+this.id_plan)

        this.nombreUsuario=this.usuario.nombre +" "+this.usuario.apellidop
        if(this.rolUsuario=="sop"){
          this.mostrarClinicas=true
          this.mostrarUsuarios=true
          this.mensajeVigencia=""
          this.mensajeRestanDias=""
          this.linkPlanes=""
        }
        if(this.rolUsuario=="suadmin"){
          this.mostrarUsuarios=true
          if(this.id_plan == "0401PF30"){
            this.mensajeVigencia=Mensajes.PRUEBA_GRATUITA_30;
            this.mensajeRestanDias="Quedan "+localStorage.getItem('dias_restantes_p_g')+" días"
            this.linkPlanes="Ver planes"
          }else if(this.id_plan == "0402PF3T"){
            this.mensajeVigencia=Mensajes.PRUEBA_TERMINADA
            this.mensajeRestanDias=""
            this.linkPlanes="Ver planes"
          }
          
        }
        if(this.rolUsuario=="adminn1"){
          this.mostrarUsuarios=true
          this.mensajeVigencia=""
          this.mensajeRestanDias=""
          this.linkPlanes=""
        }
        if(this.rolUsuario=="adminn2" || this.rolUsuario=="medic" || this.rolUsuario=="caja" || this.rolUsuario=="recepcion"){
          this.mostrarUsuarios=false
          this.mensajeVigencia=""
          this.mensajeRestanDias=""
          this.linkPlanes=""
        }
        //console.log("Usuario sidebar:: ")
        //console.log(this.usuario)
        this.inicializarAccordion()
      },
      err => console.log("error: " + err)
    )

    this.sharedService.getNombreUsuario().subscribe(datoRecibido => {
      this.nombreUsuario = datoRecibido;
    });

    this.sharedService.getMensajeVigenciaPlanGratuito().subscribe(datoRecibido => {
      this.mensajeVigencia = datoRecibido;
    });

    this.sharedService.getDiasRestantesPlanGratuito().subscribe(datoRecibido => {
      this.mensajeRestanDias = "Restan "+datoRecibido+" días";
    });


  }

  selectedIdUser(){
    this.router.navigate(['/password', this.idUsuario]);
  }

  irAPerfil(){
    const id = localStorage.getItem('_us');
    this.router.navigate(['/perfil/', id]);
  }
  salir(){
    this.authService.logout()
  }

  inicializarAccordion(): void {
    $(function() {
      var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;
        var links = this.el.find('.link');
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
      var accordion2 = new Accordion($('#accordion2'), false);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observeSizeChanges();
    }, 500);
  }

  private observeSizeChanges(): void {
    const medidor = this.medidor.nativeElement;

    //const spanUsuarios = this.spanUsuarios.nativeElement;

    const elementsClass = document.querySelectorAll('.noneBlock');

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        //console.log('El tamaño cambió:', entry.contentRect.width, 'x', entry.contentRect.height);
        if(entry.contentRect.width < 195){

          //spanUsuarios.classList.add('oculto');
          //spanUsuarios.classList.remove('mostrar');

          elementsClass.forEach(element => {
            this.renderer.setStyle(element, 'display', 'none');
          });

        }else{
          //spanUsuarios.classList.add('mostrar');
          //spanUsuarios.classList.remove('oculto');

          elementsClass.forEach(element => {
            this.renderer.setStyle(element, 'display', 'inline');
          });
          
        }
      });
    });
    resizeObserver.observe(medidor);
  }

}
