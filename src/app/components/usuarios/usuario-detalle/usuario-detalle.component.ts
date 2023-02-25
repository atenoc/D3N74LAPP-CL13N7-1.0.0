import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {

  id: string
  usuario: Usuario
  
  constructor(private activatedRoute: ActivatedRoute, private usuariosService:UsuarioService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      //console.log("id obtenido: " + this.id)
      this.usuariosService.getUsuario$(this.id)   //volver a llamar los datos con el id recibido
      .subscribe(
        res => {
          this.usuario = res;
          console.log("id obtenido:" + res.id)
        },
        err => console.log("error: " + err)
      )

    });
  }

  updateUsuario(correo: HTMLInputElement, llave: HTMLInputElement, rol: HTMLInputElement): boolean {
    this.usuariosService.updateUsuario(this.usuario.id, correo.value, llave.value, rol.value)
      .subscribe(res => {
        console.log("Usuario actualizado: "+res);
        this.router.navigate(['/usuarios']);
      });

    return false;
  }

}
