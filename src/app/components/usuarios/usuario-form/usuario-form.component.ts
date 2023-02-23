import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  user = { }
  usuario:Usuario

  constructor(private usuarioService:UsuarioService, private router: Router) { }

  ngOnInit() {
  }

  crearUsuario(){
    console.log("Usuario a registrar: "+ JSON.stringify(this.user))
    this.usuarioService.createUsuario(this.user)
    .subscribe(
      res => {
        //console.log("Usuario creado: "+JSON.stringify(res))
        console.log("Usuario creado")
        this.router.navigate(['/usuarios'])
      },
      err => console.log(err)
    )
  }

}
