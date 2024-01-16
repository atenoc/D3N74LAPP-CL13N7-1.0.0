import { Component, HostListener, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timegridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Cita } from 'src/app/models/Cita.model';
import { CitaService } from 'src/app/services/citas/cita.service';
import { CitaFormComponent } from '../cita-form/cita-form.component';
import { DetalleEventoComponent } from '../detalle-evento/detalle-evento.component';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-citas-list',
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.css']
})
export class CitasListComponent implements OnInit {

  private citasListComponent: CitasListComponent;
  aspectRatioMonth: number;
  aspectRatioValue: number;
  textButtonCita:string;
  textButtonEvento:string;

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
    this.citasListComponent = this; // Captura la instancia del componente en la variable
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowSize();
  }

  ngOnInit(): void {
    this.checkWindowSize();

    this.citas = []
    this.cargarcitas()

    this.citaService.onNuevaCita$().subscribe(() => {
      this.cargarcitas();
    });
  }

  cargarcitas(){
    this.citaService.getCitas$(localStorage.getItem('_cli')).subscribe(res=>{
      //console.log("Res cita::")
      if(res){
        this.citas = res;
        //console.log(this.citas)
        this.actualizarCalendario()
      }
    })
  }

  actualizarCalendario(){
    this.calendarOptions = {
      //aspectRatio: 2.1,
      customButtons: {
        myCustomButton: {
          text: this.textButtonCita,
          click: () => {
            this.citasListComponent.openVerticallyCentered();
          },
        },
        myCustomButton2: {
          text: this.textButtonEvento,
          click: () => {
            this.citasListComponent.openEventForm()
          }
        }
      },
      initialView: 'listMonth', // Puedes cambiar a 'listWeek' o 'listDay' según tu preferencia
      views: {
        listMonth:{
          aspectRatio: this.aspectRatioMonth
        },
        listWeek:{
          aspectRatio: this.aspectRatioValue,
          scrollTime: '08:00:00',
        },
        listDay:{
          aspectRatio: this.aspectRatioValue,
          scrollTime: '08:00:00',
        }
      },
      plugins: [listPlugin, interactionPlugin],
      locale: esLocale,
      headerToolbar: {
        left: 'prev,today,next myCustomButton myCustomButton2',
        center: 'title',
        right: 'listMonth,listWeek,listDay',
      },
      buttonText: {
        listMonth: 'Mes',
        listWeek: 'Semana',
        listDay: 'Día',
      },
      events: this.citas,
      eventClick: (info)=> {
        
        this.modalRef = this.modalService.open(DetalleEventoComponent, { centered: true, size: 'sm', backdrop: true }); //{ centered: true, size: 'sm' });
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
      //listDayFormat: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'}, //domingo, 23 de enero de 2023

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

  private checkWindowSize(): void {
    const windowWidth = window.innerWidth;
    console.log("Tamaño pantalla: "+windowWidth)

    if (windowWidth <= 500) {
      this.aspectRatioMonth=0.6
      this.aspectRatioValue=0.6
      this.textButtonCita="cita";
      this.textButtonEvento="evento";
    } else if (windowWidth > 500 && windowWidth < 800) {
      this.aspectRatioMonth=1
      this.aspectRatioValue=1
      this.textButtonCita="+ cita";
      this.textButtonEvento="+ evento";
    } else if (windowWidth >= 800 ) {
      this.aspectRatioMonth=1.5
      this.aspectRatioValue=2.3
      this.textButtonCita="Agregar cita";
      this.textButtonEvento="Agregar evento";
    }
  }

}
