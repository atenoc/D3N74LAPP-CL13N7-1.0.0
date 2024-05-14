import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/models/Paciente.model';
import { AuthService } from 'src/app/services/auth.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';
import { CifradoService } from 'src/app/services/cifrado.service';

@Component({
  selector: 'app-pacientes-list',
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.css']
})
export class PacientesListComponent implements OnInit {

  pacientes: Paciente[] = [];
  existenPacientes:boolean=false
  mensaje:string

  // Paginación
  currentPage = 1;      // actual
  pageSize = 10;         // default size
  orderBy = '';   // orden
  way = 'asc';          // direccion 
  totalElements:number  // total 

  isDisabled:boolean = false

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private pacienteService:PacienteService, 
    private router: Router,
  ) { }

  ngOnInit(): void {

    if(this.authService.validarSesionActiva()){

      if(this.cifradoService.getDecryptedIdPlan() == '0402PF3T'){
        this.isDisabled = true
        console.log("Prueba 30 terminada");
      }
      
      this.getPacientesByIdClinicaPaginados()
    
    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/paciente-detalle', id]);
  }

  getPacientesByIdClinicaPaginados(){
    console.log("Pacientes by Cli")
    this.pacienteService
      .getPacientesByIdClinicaPaginados$(localStorage.getItem('_cli'), this.currentPage, this.pageSize, this.orderBy, this.way)
      .subscribe((res) => {
        this.pacientes = res.data
        this.totalElements = res.pagination.totalElements
        console.log(res)
        if(this.pacientes.length <= 0){
          this.mensaje='No hay pacientes para mostrar'
        }else{
          this.existenPacientes = true;
        }
      },
      err => {
        this.mensaje='No se pudo obtener la información'
        console.log(err.error.message)
        console.log(err)
      }
      );
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.getPacientesByIdClinicaPaginados();
  }

  onPageSizeChange() {
    this.getPacientesByIdClinicaPaginados();
  }

  onSortChange(campo: string) {
    if (this.orderBy === campo) {
      this.way = this.way === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = campo;
      this.way = 'asc'; // Establece 'asc' como valor predeterminado al cambiar de columna
    }
  
    console.log("Ordenar por: " + this.orderBy);
    console.log("Modo: " + this.way);
    this.getPacientesByIdClinicaPaginados();
  }

  irPacienteForm(){
    this.router.navigate(['/paciente-form']);
  }

}
