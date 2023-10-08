import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  nombreCentro:string="Dental App"
  mostrarCambiarContrasena:boolean=true

  constructor(
    public usuarioService: UsuarioService, 
    private centroService:CentroService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("HEADER Component")

    this.usuarioService.validarUsuarioActivo$(localStorage.getItem('_us'), localStorage.getItem('_us_em')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        if(this.usuario.llave_status == 0){
          this.mostrarCambiarContrasena=true
        }else{
          this.mostrarCambiarContrasena=false
        }

        this.centroService.getCentroByIdUser$(this.idUsuario).subscribe(
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
