import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {

  contenido: String

  constructor(private contenidoService: ContenidoService) { }

  ngOnInit() {

    console.log("Contenido protegido")

    this.contenidoService.getContenido().subscribe(
      res=>{
        console.log("Respuesta: " + JSON.stringify(res) )
        this.contenido = JSON.stringify(res)
      },
     err => console.log(err)
    )
  }

}
