import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';

@Component({
  selector: 'app-centro-form',
  templateUrl: './centro-form.component.html',
  styleUrls: ['./centro-form.component.css']
})
export class CentroFormComponent implements OnInit {

  centro = { }

  constructor(private centroService:CentroService, private router: Router) { }

  ngOnInit() {
  }

  crearCentro(){

    var nuevoCentroJson = JSON.parse(JSON.stringify(this.centro))
    nuevoCentroJson.id_usuario=localStorage.getItem('id_us')
    console.log("nuevoCentroJson a registrar: "+JSON.stringify(nuevoCentroJson))

    this.centroService.createCentro(nuevoCentroJson)
    .subscribe(
      res => {
        console.log("Centro creado")
        this.router.navigate(['/perfil'])
      },
      err => console.log(err)
    )
  }

}
