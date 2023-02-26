import { Component, OnInit } from '@angular/core';
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

  constructor(private authService:AuthService, private centroService:CentroService) {}

  ngOnInit() {

    // Consulta de Usuario por Correo
    this.authService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        // Consulta Centro del usuario
        this.centroService.getCentroByIdUser$(this.usuario.id).subscribe(
          res => {
            this.centro = res;
          },
          err => console.log("error: " + err)
        ) 
      },
      err => console.log("error: " + err)
    )    
  }
}
