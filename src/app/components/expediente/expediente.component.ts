import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaPaciente } from 'src/app/models/Cita.model';
import { Paciente } from 'src/app/models/Paciente.model';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit {

  rol:string
  id: string;
  paciente:Paciente;
  tituloCard: string;

  citas:CitaPaciente[] = []

  constructor(
    private activatedRoute: ActivatedRoute, 
    private spinner: NgxSpinnerService,
    private pacienteService:PacienteService, 
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      this.spinner.show();
      this.pacienteService.getPacienteById$(this.id).subscribe(res => {   //volver a llamar los datos con el id recibido
        this.spinner.hide();
        this.paciente = res;
        console.log(res)

        this.tituloCard = this.paciente.nombre+' '+this.paciente.apellidop+' '+this.paciente.apellidom

      },
      err => {
        this.spinner.hide();
        console.log("error: " + err)
      })

    },
    err => console.log("error: " + err)
    );

  }

}
