import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Centro } from 'src/app/models/Centro.model';
import { CentroService } from 'src/app/services/centro.service';

@Component({
  selector: 'app-centro-list',
  templateUrl: './centro-list.component.html',
  styleUrls: ['./centro-list.component.css']
})
export class CentroListComponent implements OnInit {

  centros: Centro[] = [];

  constructor(private centroService:CentroService, private router: Router) { }

  ngOnInit() {
    this.centroService.getCentros().subscribe(
      res=>{
        console.log("Listado de centros <-> " + res)
        //console.log("Listado de centros: " + JSON.stringify(res))
        this.centros = res;
      },
     err => console.log(err)
    )
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/centro-detalle', id]);
  }

  deleteUser(id: string) {
    this.centroService.deleteCentro(id)
      .subscribe(res => {
        console.log("Centro eliminado:" + res)
        /* Recargamos el componente*/  
        this.ngOnInit()
        this.router.navigate(['/centros']);
      })
  }

}
