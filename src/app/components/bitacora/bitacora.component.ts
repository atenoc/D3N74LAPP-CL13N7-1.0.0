import { Component, OnInit } from '@angular/core';
import { Auditoria } from 'src/app/models/Auditoria.model';
import { AuditoriaService } from 'src/app/services/auditoria/auditoria.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {

  auditorias:Auditoria[] = [];
  existenAuditorias:boolean=false
  mensaje:string

  // Paginación
  currentPage = 1;      // actual
  pageSize = 20;         // default size
  orderBy = '';   // orden
  way = 'asc';          // direccion 
  totalElements:number  // total 

  constructor(
    private auditoriaService: AuditoriaService,
  ) { }

  ngOnInit(): void {
    this.getAuditoriasPaginadas()      

  }

  getAuditoriasPaginadas() {
    console.log("Auditorias by Cli");
    this.auditoriaService.getBitacoraByIdClinicaPaginado(localStorage.getItem('_cli'), this.currentPage, this.pageSize, this.orderBy, this.way)
      .subscribe((res) => {
        // Reemplaza los valores de tipo_evento y tabla_afectada
        this.auditorias = res.data.map(auditoria => {
          // Reemplazo de tipo_evento
          switch (auditoria.tipo_evento) {
            case 'CREATE':
              auditoria.tipo_evento = 'registró';
              break;
            case 'UPDATE':
              auditoria.tipo_evento = 'actualizó';
              break;
            case 'DELETE':
              auditoria.tipo_evento = 'eliminó';
              break;
            default:
              break;
          }
  
          // Reemplazo de tabla_afectada
          switch (auditoria.tabla_afectada) {
            case 'clinicas':
              auditoria.tabla_afectada = 'una clínica';
              break;
            case 'usuarios':
              auditoria.tabla_afectada = 'un usuario';
              break;
            case 'pacientes':
              auditoria.tabla_afectada = 'un paciente';
              break;
            case 'citas':
              auditoria.tabla_afectada = 'una cita';
              break;
            case 'historias':
              auditoria.tabla_afectada = 'una historia';
              break;    
            case 'diagnosticos':
              auditoria.tabla_afectada = 'un diagnóstico';
              break;
            case 'imagenes':
              auditoria.tabla_afectada = 'una imagen';
              break;
            case 'tratamientos':
              auditoria.tabla_afectada = 'un tratamiento';
              break;
            case 'seguimientos':
              auditoria.tabla_afectada = 'un seguimiento';
              break;
            default:
              break;
          }
  
          return auditoria;
        });
  
        this.totalElements = res.pagination.totalElements;
        console.log(res);
        if (this.auditorias.length <= 0) {
          this.mensaje = 'No hay registros para mostrar';
        } else {
          this.existenAuditorias = true;
        }
      },
      err => {
        this.mensaje = 'No se pudo obtener la información';
        console.log(err.error.message);
        console.log(err);
      });
  }
  
  

  onPageChange(event: any) {
    this.currentPage = event;
    this.getAuditoriasPaginadas();
  }

  onPageSizeChange() {
    this.getAuditoriasPaginadas();
  }

  getColor(tipoEvento: string): string {
    switch (tipoEvento) {
      case 'registró':
        return '#28a745'; // o cualquier tono de verde
      case 'actualizó':
        return '#007bff'; // o cualquier tono de azul
      case 'eliminó':
        return '#dc3545'; // o cualquier tono de rojo
      default:
        return 'transparent'; // color por defecto si no hay coincidencia
    }
  }

}
