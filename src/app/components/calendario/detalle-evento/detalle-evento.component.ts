import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit {

  @Input() title: string;
  @Input() inicio: string;
  @Input() fin: string;

  constructor() { }

  ngOnInit(): void {
  }

}
