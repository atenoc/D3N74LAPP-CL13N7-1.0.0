import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cita, CitaEditar, CitaPaciente } from 'src/app/models/Cita.model';
import { AuthService } from 'src/app/services/auth.service';
import { CitaService } from 'src/app/services/citas/cita.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';

@Component({
  selector: 'app-detalle-visita',
  templateUrl: './detalle-visita.component.html',
  styleUrls: ['./detalle-visita.component.css']
})
export class DetalleVisitaComponent implements OnInit {

  id: string;
  rol:string
  cita:CitaEditar
  tituloPagina:string

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private activatedRoute: ActivatedRoute, 
    private citasService: CitaService
  ) { }

  ngOnInit(): void {

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol == "sop" || this.rol == "suadmin" || this.rol == "adminn1" || this.rol == "adminn2" || this.rol == "medic"){

        this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          console.log("Id cita recuperada: " +this.id)
        }),
        err => console.log("error: " + err)


        this.citasService.getCitaById$(this.id).subscribe(res =>{
          console.log(res)
          this.tituloPagina = res.title +" / "+ res.motivo +" / " +res.start 
        }),
        err => console.log("error: " + err)

      
      }

    }

    

  }

}
