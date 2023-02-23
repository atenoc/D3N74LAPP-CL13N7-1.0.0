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
        console.log("Listado de centros: " + JSON.stringify(res) )
        this.centros = res;
      },
     err => console.log(err)
    )
  }

}
