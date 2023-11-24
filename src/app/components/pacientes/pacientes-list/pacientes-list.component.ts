import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/Paciente.model';
import { AuthService } from 'src/app/services/auth.service';
import { PacienteService } from 'src/app/services/pacientes/paciente.service';

@Component({
  selector: 'app-pacientes-list',
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.css']
})
export class PacientesListComponent implements OnInit {

  usuarios: Paciente[] = [];
  existenUsuarios:boolean=false
  mensaje:string

  // Paginación
  currentPage = 1;      // actual
  pageSize = 9;         // default size
  orderBy = '';   // orden
  way = 'asc';          // direccion 
  totalElements:number  // total 

  constructor(
    private authService:AuthService,
    private usuarioService:PacienteService, 
  ) { }

  ngOnInit(): void {

    if(this.authService.validarSesionActiva()){
      this.getPacientesByIdClinicaPaginados()
    }
  }

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
  }

  getPacientesByIdClinicaPaginados(){
    console.log("Users by Cli")
    this.usuarioService
      .getPacientesByIdClinicaPaginados$(localStorage.getItem('_cli'), this.currentPage, this.pageSize, this.orderBy, this.way)
      .subscribe((res) => {
        this.usuarios = res.data
        this.totalElements = res.pagination.totalElements
        console.log(res)
        if(this.usuarios.length <= 0){
          this.mensaje='No hay pacientes para mostrar'
        }else{
          this.existenUsuarios = true;
        }
      });
  }

  onPageChange(event: any) {
    this.currentPage = event;
    //this.getUsuariosPaginados();
    this.getPacientesByIdClinicaPaginados();
  }

  onPageSizeChange() {
    //this.getUsuariosPaginados();
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
    //this.getUsuariosPaginados();
    this.getPacientesByIdClinicaPaginados();
  }

}
