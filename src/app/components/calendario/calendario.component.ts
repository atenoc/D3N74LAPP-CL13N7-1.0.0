import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timegridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DetalleEventoComponent } from './detalle-evento/detalle-evento.component';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  modalRef: NgbModalRef;

  date = new Date()
  d = this.date.getDate()
  m = this.date.getMonth()
  y = this.date.getFullYear()

  calendarOptions: CalendarOptions = {};

  constructor(private modalService: NgbModal, config: NgbModalConfig) {
    //config.backdrop = 'static';
    //config.keyboard = false;
  }

  ngOnInit(): void {

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, timegridPlugin, interactionPlugin],
      locale: esLocale,
      headerToolbar:{
        left:'prev,today,next',
        center:'title',
        right:'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [
        {
          title          : 'All Day Event',
          start          : new Date(this.y, this.m, 1),
          backgroundColor: '#f56954', //red
          borderColor    : '#f56954', //red
          allDay         : true
        },
        {
          title          : 'Long Event',
          start          : new Date(this.y, this.m, this.d - 5),
          end            : new Date(this.y, this.m, this.d - 2),
          backgroundColor: '#f39c12', //yellow
          borderColor    : '#f39c12' //yellow
        },
        {
          title          : 'Consulta - Roni Juarez',
          start          : new Date(this.y, this.m, this.d, 10, 30),
          end            : new Date(this.y, this.m, this.d, 10, 59),
          allDay         : false,
          backgroundColor: '#0073b7', //Blue
          borderColor    : '#0073b7' //Blue
        },
        {
          title          : 'Consulta - Roni Juarez',
          start          : new Date(this.y, this.m, this.d, 11, 30),
          allDay         : false,
          backgroundColor: '#0073b7', //Blue
          borderColor    : '#0073b7' //Blue
        },
        {
          title          : 'Consulta - Roni Juarez',
          start          : new Date(this.y, this.m, this.d, 12, 30),
          allDay         : false,
          backgroundColor: '#0073b7', //Blue
          borderColor    : '#0073b7' //Blue
        },
        {
          title          : 'Consulta - Roni Juarez',
          start          : new Date(this.y, this.m, this.d, 13, 30),
          allDay         : false,
          backgroundColor: '#0073b7', //Blue
          borderColor    : '#0073b7' //Blue
        },
        {
          title          : 'Comidita de día',
          start          : new Date(this.y, this.m, this.d, 12, 0),
          end            : new Date(this.y, this.m, this.d, 14, 0),
          allDay         : false,
          backgroundColor: '#00c0ef', //Info (aqua)
          borderColor    : '#00c0ef' //Info (aqua)
        },
        {
          title          : 'Fiestesita por mi cumple',
          start          : new Date(this.y, this.m, this.d + 1, 19, 0),
          end            : new Date(this.y, this.m, this.d + 1, 22, 30),
          allDay         : false,
          backgroundColor: '#00a65a', //Success (green)
          borderColor    : '#00a65a' //Success (green)
        },
        {
          title          : 'Click for Google',
          start          : new Date(this.y, this.m, 28),
          end            : new Date(this.y, this.m, 29),
          url            : 'https://www.google.com/',
          backgroundColor: '#3c8dbc', //Primary (light-blue)
          borderColor    : '#3c8dbc' //Primary (light-blue)
        }
      ],
      eventClick: (info)=> {
        const title = info.event.title;
        const inicio = info.event.start;
        const fin = info.event.end;
        //alert('Evento clickeadoss: ' + title);
        this.modalRef = this.modalService.open(DetalleEventoComponent, { centered: true, size: 'sm' });
        this.modalRef.componentInstance.title = title;
        this.modalRef.componentInstance.inicio = inicio;
        this.modalRef.componentInstance.fin = fin;
      },
    };

  }
}
