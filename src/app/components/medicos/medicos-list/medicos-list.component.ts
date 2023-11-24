import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { MedicoService } from 'src/app/services/medicos/medico.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';

@Component({
  selector: 'app-medicos-list',
  templateUrl: './medicos-list.component.html',
  styleUrls: ['./medicos-list.component.css']
})
export class MedicosListComponent implements OnInit {

  medicos: Usuario[] = [];
  existenUsuarios:boolean=false
  mensaje:string

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private usuarioService:MedicoService, 
    ) { }

  ngOnInit(): void {

    if(this.authService.validarSesionActiva()){
      this.getMedicosByIdClinica()
    }

  }

  getMedicosByIdClinica(){
    console.log("Users by Cli")
    this.usuarioService
      .getMedicos$(localStorage.getItem('_cli'))
      .subscribe((res) => {
        this.medicos = res
        console.log(res)
        if(this.medicos.length <= 0){
          this.mensaje='No hay médicos que mostrar'
        }else{
          this.existenUsuarios = true;
        }
      });
  }

}
