import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timegridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DetalleEventoComponent } from './detalle-evento/detalle-evento.component';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { CitaFormComponent } from './cita-form/cita-form.component';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Cita } from 'src/app/models/Cita.model';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  private calendarComponent: CalendarioComponent;

  modalRef: NgbModalRef;
/*
  date = new Date()
  d = this.date.getDate()
  m = this.date.getMonth()
  y = this.date.getFullYear()
  */

  calendarOptions: CalendarOptions = {};

  citas:Cita[] = []

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
    private citaService:CitaService
    ) {
      config.backdrop = 'static';
		  config.keyboard = false;
      this.calendarComponent = this; // Captura la instancia del componente en la variable
  }

  ngOnInit(): void {

    this.citas = []

    this.citaService.getCitas$().subscribe(res=>{
      console.log("Res cita::")
      if(res){
        this.citas = res;
        this.actualizarCalendario()
      }
    })

  }

  actualizarCalendario(){
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
      events: this.citas,
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
