import { Component, OnInit, Input } from '@angular/core';
import { DetalleEvento } from 'src/app/models/DetalleEvento.model';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit {

  @Input() title: string;
  @Input() inicio: string;
  @Input() fin: string;
  @Input() data: DetalleEvento;

  constructor() { }

  ngOnInit(): void {
  }

}
