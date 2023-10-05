import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { SharedService } from './services/shared.service';
import { Usuario } from './models/Usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'dentalapp-client';

  usuario:Usuario
  usuarioActivo:Boolean

  constructor(
    public sharedService: SharedService,
    public usuarioService: UsuarioService, 
    ) { }

  ngOnInit():void{
    this.sharedService.notifyApp.subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });

    console.log("App Component")

    this.usuarioService.getUsuarioById$(localStorage.getItem('_us')).subscribe(
      res => {
        this.usuario = res;
        if(this.usuario){
          console.log("SESION ACTIVA")
          this.usuarioActivo=true
        }
      },
      err => console.log("error AppComponent: " + err)
    )
  }

}
