import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { MedicoService } from 'src/app/services/medicos/medico.service';
import { CifradoService } from 'src/app/services/cifrado.service';

@Component({
  selector: 'app-medicos-list',
  templateUrl: './medicos-list.component.html',
  styleUrls: ['./medicos-list.component.css']
})
export class MedicosListComponent implements OnInit {

  rol:string

  medicos: Usuario[] = [];
  existenMedicos:boolean=false
  mensaje:string

  mostrarBotonAddMedico:boolean = false

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private medicoService:MedicoService, 
    private router: Router, 
    ) { }

  ngOnInit(): void {

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();
      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1"){
        this.mostrarBotonAddMedico = true
      }

      this.getMedicosByIdClinica()
    }
  }

  getMedicosByIdClinica(){
    console.log("Users by Cli")
    this.medicoService
      .getMedicos$(localStorage.getItem('_cli'))
      .subscribe((res) => {
        this.medicos = res
        console.log(res)
        if(this.medicos.length <= 0){
          this.mensaje='No hay médicos que mostrar'
        }else{
          this.existenMedicos = true;
        }
      },
      err => {
        this.mensaje='No se pudo obtener la información'
        console.log(err.error.message)
        console.log(err)
      }
      
      );
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

}
