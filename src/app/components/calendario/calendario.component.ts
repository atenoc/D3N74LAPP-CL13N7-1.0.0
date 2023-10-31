import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timegridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  date = new Date()
  d = this.date.getDate()
  m = this.date.getMonth()
  y = this.date.getFullYear()

  calendarOptions: CalendarOptions = {
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
        title          : 'Consulta - Uriel Roni Juarez',
        start          : new Date(this.y, this.m, this.d, 10, 30),
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
  };

  constructor() { }

  ngOnInit(): void {

  }

}
