import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaPaciente } from 'src/app/models/Cita.model';
import { CitaService } from 'src/app/services/citas/cita.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent implements OnInit {

  id: string;
  citas:CitaPaciente[] = []
  mensaje:string
  existenVisitas:boolean=false

  constructor(
    private activatedRoute: ActivatedRoute, 
    private spinner: NgxSpinnerService,
    private citasService: CitaService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      this.cargarCitas()

    },
    err => console.log("error: " + err)
    );
  }

  cargarCitas(){
    console.log("This id: "+this.id)

    this.spinner.show()
    this.citasService.getCitasByIdPaciente(this.id).subscribe (res => {
      this.spinner.hide();
      console.log("Citas:")
      this.citas = res
      console.log(this.citas)

      if(this.citas.length <= 0){
        this.mensaje='No hay visitas para mostrar'
      }else{
        this.existenVisitas = true;
      }

    },
    err => {
      this.spinner.hide();
      console.log("error: "+ err)
    }
  )}

}
