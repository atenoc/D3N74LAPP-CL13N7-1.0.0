import { Component, OnInit } from '@angular/core';
import {f} from '../../../assets/js/full-calendar-init.js'

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    require('../../../assets/js/full-calendar-init.js');
  }

}
