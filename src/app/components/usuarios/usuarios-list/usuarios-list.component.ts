import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbModal, NgbModalConfig, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario:Usuario
  formularioDetalleUsuario:FormGroup
  existenUsuarios:boolean=false
  mensaje:string
  rol:string
 
  // Paginación
  currentPage = 1;      // actual
  pageSize = 5;         // default size
  orderBy = '';   // orden
  way = 'asc';          // direccion 
  totalElements:number  // total 

  isDisabled:boolean = false

  constructor(
    private authService:AuthService,
    private usuarioService:UsuarioService, 
    private router: Router, 
    private modalService: NgbModal,
    private paginationConfig: NgbPaginationConfig, 
    private cifradoService: CifradoService,
    config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
      paginationConfig.pageSize = this.pageSize;  
    }

  ngOnInit() {
    console.log("USUARIOS LIST COMP")

    if(this.authService.validarSesionActiva()){

      if(this.cifradoService.getDecryptedIdPlan() == '0402PF3T'){
        this.isDisabled = true
        console.log("Prueba 30 terminada");
      }

      this.rol = this.cifradoService.getDecryptedRol();
      console.log("Rol Des:: "+this.rol)

      if(this.rol == "sop"){
        // Falta validar si tiene centro agregado
        this.getUsuariosPaginados();
      }

      else if(this.rol == "suadmin"){ 
        // Falta validar si tiene centro agregado
        this.getUsuariosByIdClinicaPaginados();
      }

      else if(this.rol == "adminn1"){ 
        this.getUsuariosByIdClinicaPaginados();
      }else{
        this.router.navigate(['/pagina/404/no-encontrada'])
      }

    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
    
  }

  openVerticallyCentered(content) {
    console.log("OPEN MODAL")
		//this.modalService.open(content, { centered: true });
    this.modalService.open(content, { size: 'lg', centered: true });
	}

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  irUsuarioForm(){
    this.router.navigate(['/usuario-form']);
  }

  getUsuariosPaginados() {
    console.log("Users by Sop")
    this.usuarioService
      .getUsuariosByUsuarioPaginados$(localStorage.getItem('_us'), this.currentPage, this.pageSize, this.orderBy, this.way)
      .subscribe((res) => {
        this.usuarios = res.data
        this.totalElements = res.pagination.totalElements
        console.log(res)
        
        if(this.usuarios.length <= 0){
          this.mensaje='¡No hay usuarios!'
        }else{
          this.existenUsuarios = true;
        }
      });
  }

  getUsuariosByIdClinicaPaginados(){
    console.log("Users by Cli")
    this.usuarioService
      .getUsuariosByIdClinicaPaginados$(localStorage.getItem('_cli'), this.currentPage, this.pageSize, this.orderBy, this.way)
      .subscribe((res) => {
        this.usuarios = res.data
        this.totalElements = res.pagination.totalElements
        console.log(res)
        if(this.usuarios.length <= 0){
          this.mensaje='No hay usuarios para mostrar'
        }else{
          this.existenUsuarios = true;
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
    //this.getUsuariosPaginados();
    this.getUsuariosByIdClinicaPaginados();
  }

  onPageSizeChange() {
    //this.getUsuariosPaginados();
    this.getUsuariosByIdClinicaPaginados();
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
    this.getUsuariosByIdClinicaPaginados();
  }
  
}