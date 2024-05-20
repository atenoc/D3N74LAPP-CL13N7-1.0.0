import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paciente } from 'src/app/models/Paciente.model';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';

@Component({
  selector: 'app-diagnostico-tratamiento',
  templateUrl: './diagnostico-tratamiento.component.html',
  styleUrls: ['./diagnostico-tratamiento.component.css']
})
export class DiagnosticoTratamientoComponent implements OnInit {

  id: string;
  rol:string
  //cita:CitaEditar
  tituloPagina:string

  paciente:Paciente;

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private activatedRoute: ActivatedRoute, 
    //private citasService: CitaService,
    private pacienteService:PacienteService, 
  ) { }

  ngOnInit(): void {

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1" || this.rol == "adminn2" || this.rol == "medic"){

        this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          console.log("Id paciente recuperado: " +this.id)

          this.pacienteService.getPacienteById$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
            this.paciente = res;
            console.log(res)
            this.tituloPagina = res.nombre +" "+ res.apellidop +" " +res.apellidom
          },
          err => {
            console.log("error: " + err)
          })

        }),
        err => console.log("error: " + err)


        /*this.citasService.getCitaById$(this.id).subscribe(res =>{
          console.log(res)
          this.tituloPagina = res.title +" / "+ res.motivo +" / " +res.start 
        }),
        err => console.log("error: " + err)
        */

      
      }

    }

  }

}
