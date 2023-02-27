import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario
  centro: Centro
  idCentro:string

  constructor(private authService:AuthService, private centroService:CentroService, private router:Router) {}

  ngOnInit() {

    // Consulta de Usuario por Correo
    this.authService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        // Consulta Centro del usuario
        this.centroService.getCentroByIdUser$(this.usuario.id).subscribe(
          res => {
            this.centro = res;
            this.idCentro=this.centro.id;
          },
          err => console.log("error: " + err)
        ) 
      },
      err => console.log("error: " + err)
    )    
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/centro-detalle', id]);
  }

}
