import { Component, OnInit } from '@angular/core';
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

  constructor(
    private sharedService:SharedService,
    public usuarioService: UsuarioService, 
    private centroService:CentroService,
    private router: Router) { }

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

}
