import { Component, OnInit, Renderer2 } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateInfo } from '../utils/validateInfo';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  usuario:Usuario
  rolUsuario:string
  mostrarClinicas:boolean=false;
  mostrarUsuarios:boolean=false;
  isDarkMode = false;

  date: Date;
  numberAnio:number

  constructor(
    public authService: AuthService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    console.log("FOOTER")
    this.date = new Date();
    this.numberAnio = this.date.getFullYear()

    const valudateUser = ValidateInfo.getUserInfo()

    if(localStorage.getItem('_us') && localStorage.getItem('_em')){
      this.authService.validarUsuarioActivo$(valudateUser).subscribe(
        res => {
          this.usuario = res;
          this.rolUsuario=this.usuario.rol
  
          if(this.rolUsuario=="sop"){
            this.mostrarClinicas=true
            this.mostrarUsuarios=true
          }
          if(this.rolUsuario=="suadmin"){
            this.mostrarUsuarios=true
          }
          if(this.rolUsuario=="adminn1"){
            this.mostrarUsuarios=true
          }
          if(this.rolUsuario=="adminn2" || this.rolUsuario=="medic" || this.rolUsuario=="caja" || this.rolUsuario=="recepcion"){
            this.mostrarUsuarios=false
          }
        },
        err => console.log("error: " + err)
      )
    }
  }

  salir(){
    this.authService.logout()
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const body = document.body;
    if (this.isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
    }
  }

}
