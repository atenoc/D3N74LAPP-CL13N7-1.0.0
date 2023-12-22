import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  rol:string
  mostrarClinicas:boolean=false;
  mostrarUsuarios:boolean=false;

  constructor(
    public authService: AuthService,
    private cifradoService: CifradoService,
  ) { }

  ngOnInit(): void {
    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol=="sop"){
        this.mostrarClinicas=true
        this.mostrarUsuarios=true
      }
      if(this.rol=="suadmin"){
        this.mostrarUsuarios=true
      }
      if(this.rol=="adminn1"){
        this.mostrarUsuarios=true
      }
      if(this.rol=="adminn2" || this.rol=="medic" || this.rol=="caja" || this.rol=="recepcion"){
        this.mostrarUsuarios=false
      }
    }
  }

  salir(){
    this.authService.logout()
  }

}
