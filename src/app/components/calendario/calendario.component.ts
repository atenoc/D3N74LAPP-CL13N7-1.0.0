import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timegridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DetalleEventoComponent } from './detalle-evento/detalle-evento.component';
import { CitaFormComponent } from './cita-form/cita-form.component';
import { CitaService } from 'src/app/services/citas/cita.service';
import { Cita } from 'src/app/models/Cita.model';
import { EventFormComponent } from './event-form/event-form.component';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  private calendarComponent: CalendarioComponent;

  modalRef: NgbModalRef;
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
    this.cargarcitas()
    
    // Suscribirse al BehaviorSubject de nueva cita
    this.citaService.onNuevaCita$().subscribe(() => {
      // Recargar las citas y actualizar el calendario
      this.cargarcitas();
    });

  }

  cargarcitas(){
    this.citaService.getCitas$().subscribe(res=>{
      console.log("Res cita::")
      if(res){
        this.citas = res;
        //console.log(this.citas)
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
        },
        myCustomButton2: {
          text: 'Agregar evento',
          click: () => {
            this.calendarComponent.openEventForm()
          }
        }
      },
      initialView: 'dayGridMonth',
      views: {
        timeGridWeek:{
          aspectRatio: 2.3,
          scrollTime: '08:00:00',
        },
        timeGridDay:{
          aspectRatio: 2.3,
          scrollTime: '08:00:00',
        }
      },
      plugins: [dayGridPlugin, timegridPlugin, interactionPlugin],
      locale: esLocale,
      headerToolbar:{
        left:'prev,today,next myCustomButton myCustomButton2',
        center:'title',
        right:'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: this.citas,
      eventClick: (info)=> {
        
        this.modalRef = this.modalService.open(DetalleEventoComponent, { centered: true, size: 'sm' }); //{ centered: true, size: 'sm' });
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
      noEventsText:'No hay citas para mostrar',
      listDayFormat: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'}, //domingo, 23 de enero de 2023

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
    this.modalService.open(CitaFormComponent, { centered: true, size: 'lg' });
  }

  openEventForm() {
    this.modalService.open(EventFormComponent, { centered: true });
  }
}
