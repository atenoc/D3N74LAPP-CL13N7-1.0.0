import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { MedicoService } from 'src/app/services/medicos/medico.service';

@Component({
  selector: 'app-medicos-list',
  templateUrl: './medicos-list.component.html',
  styleUrls: ['./medicos-list.component.css']
})
export class MedicosListComponent implements OnInit {

  medicos: Usuario[] = [];
  existenPacientes:boolean=false
  mensaje:string

  constructor(
    private authService:AuthService,
    private usuarioService:MedicoService, 
    private router: Router, 
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
          this.existenPacientes = true;
        }
      });
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

}
