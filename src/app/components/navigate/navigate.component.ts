import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, NavigationEnd } from '@angular/router';
import { faUser, faHome, faUsers, faBuilding, faArrowRight, faCalendarDay, faAddressCard, faEnvelope } from '@fortawesome/free-solid-svg-icons'

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
  llaveStatus:number
  nombreCentro:string="Dental App"
  mostrarTitulo:boolean=true
  mostrarBotonIngresar:boolean=true
  mostrarCambiarContrasena:boolean=true

  //icons

  faUser=faUser;
  faHome=faHome;
  faUsers=faUsers;
  faBuilding=faBuilding;
  faArrowRight=faArrowRight;
  faCalendarDay=faCalendarDay;
  faAddressCard=faAddressCard;
  faEnvelope=faEnvelope;

  constructor(private sharedService:SharedService, public authService: AuthService, public usuarioService: UsuarioService, private centroService:CentroService,
    private router: Router) { }

  ngOnInit() {
    console.log("NAVIGATE Component")

    this.sharedService.getData().subscribe(data => {
      this.mostrarCambiarContrasena = data;
      //console.log("Actualizar Navigate")
      //console.log("Mostrar Cambiar contraeña: "+ this.mostrarCambiarContrasena)
    });

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


    this.usuarioService.getUsuarioById$(localStorage.getItem('_us')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        this.correoUsuario=this.usuario.correo
        this.rolUsuario=this.usuario.desc_rol
        this.nombreUsuario=this.usuario.nombre
        this.llaveStatus=this.usuario.llave_status
        //console.log("Rol Navigate: " + this.usuario.desc_rol)
        //console.log("Llave status Navigate: " + this.usuario.llave_status)
        if(this.usuario.llave_status == 0){
          this.mostrarCambiarContrasena=true
        }else{
          this.mostrarCambiarContrasena=false
        }

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

  selectedIdUser(){
    this.router.navigate(['/password', this.idUsuario]);
  }

  salir(){
    this.authService.logout()

    this.sharedService.mensajeActual.subscribe(
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
    //console.log("reload navigate <-")
  }

}
