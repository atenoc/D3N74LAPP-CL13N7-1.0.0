import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuariosService:UsuarioService, private router: Router) { }

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe(
      res=>{
        console.log("Listado de usuarios <-> " + res)
        //console.log("Listado de usuarios: " + JSON.stringify(res))
        this.usuarios = res;
      },
     err => console.log(err)
    )
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  deleteUser(id: string) {
    this.usuariosService.deleteUsuario(id)
      .subscribe(res => {
        console.log("Usuario eliminado:" + res)
        /* Recargamos el componente*/  
        this.ngOnInit()
        this.router.navigate(['/usuarios']);
      })
  }

}
