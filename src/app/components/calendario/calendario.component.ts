import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timegridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DetalleEventoComponent } from './detalle-evento/detalle-evento.component';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { CitaFormComponent } from './cita-form/cita-form.component';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  private calendarComponent: CalendarioComponent;

  modalRef: NgbModalRef;

  date = new Date()
  d = this.date.getDate()
  m = this.date.getMonth()
  y = this.date.getFullYear()

  calendarOptions: CalendarOptions = {};

  constructor(
    private modalService: NgbModal,
    ) {
      this.calendarComponent = this; // Captura la instancia del componente en la variable
  }

  ngOnInit(): void {

    this.calendarOptions = {
      customButtons: {
        myCustomButton: {
          text: 'Agregar cita',
          click: () => {
            //alert('clicked the custom button!');
            this.calendarComponent.openVerticallyCentered()
          }
        }
      },
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, timegridPlugin, listPlugin, interactionPlugin],
      locale: esLocale,
      headerToolbar:{
        left:'prev,today,next myCustomButton',
        center:'title',
        right:'dayGridMonth,timeGridWeek,timeGridDay,list'
      },
      events: [
        {
          title          : 'Evento de todo el día',
          start          : new Date(this.y, this.m, 1),
          backgroundColor: '#f56954', //red
          borderColor    : '#f56954', //red
          allDay         : true
        },
        {
          title          : 'Evento Largo',
          start          : new Date(this.y, this.m, this.d - 5),
          end            : new Date(this.y, this.m, this.d - 2),
          backgroundColor: '#f39c12', //yellow
          borderColor    : '#f39c12', //yellow
          editable       : true
        },
        {
          title          : 'Consulta - Uriel J',
          start          : new Date(this.y, this.m, this.d, 10, 30),
          end            : new Date(this.y, this.m, this.d, 10, 59),
          allDay         : false,
          backgroundColor: '#000000', //Blue
          borderColor    : '#ff0000', //Red
          editable       : true,
          data: {
            id                : '32131221',
            motivo            : 'Consulta',
            comentarios       : 'Sin comenatarios',
            id_estatus_cita   : 'CITA_01',
            id_estatus_pago   : 'EST_PAG_05',
            id_tipo_pago      : 'T_PAG_03',
            id_medico         : '2321321',
            id_paciente       : '123123123',
            id_clinica        : '34567567',
            id_usuario        : '789789789',
            fecha_creacion    : '10/10/2023',
          }
        },
        {
          title          : 'Consulta - Victor Z',
          start          : new Date(this.y, this.m, this.d, 11, 30),
          allDay         : false,
          backgroundColor: '#0073b7', //Blue
          borderColor    : '#0073b7' //Blue
        },
        {
          title          : 'Consulta - Maria Fer',
          start          : new Date(this.y, this.m, this.d, 12, 30),
          allDay         : false,
          backgroundColor: '#0073b7', //Blue
          borderColor    : '#0073b7' //Blue
        },
        {
          title          : 'Consulta - Chicharito',
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
        
        this.modalRef = this.modalService.open(DetalleEventoComponent, { centered: true, size: 'sm' });
        this.modalRef.componentInstance.title = info.event.title;

        const inicioFormateado = this.formatDate(info.event.start);
        this.modalRef.componentInstance.inicio = inicioFormateado;

        if(info.event.end){
          const finFormateado = this.formatDate(info.event.end);
          this.modalRef.componentInstance.fin = finFormateado;
        }

        this.modalRef.componentInstance.data = info.event.extendedProps.data;

        this.modalRef.result.finally(() => {
          console.log("Secerró el modal")
        });
      },
    };

    ///

  }

  formatDate(date){
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses en JavaScript se cuentan desde 0
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    //const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  openVerticallyCentered() {
    this.modalService.open(CitaFormComponent, { centered: true });
  }
}
