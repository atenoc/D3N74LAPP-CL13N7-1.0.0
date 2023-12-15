import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Centro } from 'src/app/models/Centro.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centro-detalle',
  templateUrl: './centro-detalle.component.html',
  styleUrls: ['./centro-detalle.component.css']
})
export class CentroDetalleComponent implements OnInit {

  rol:string
  id: string
  centro: Centro
  formularioCentro:FormGroup

  //mensajes
  campoRequerido: string;
  correoValido: string;
  contrasenaLongitud: string;
  telefonoLongitud: string;
  soloNumeros: string;

  constructor(
    private authService:AuthService,
    private cifradoService: CifradoService,
    private formBuilder:FormBuilder, 
    //private activatedRoute: ActivatedRoute,
    private centroService:CentroService, 
    private modalService: NgbModal,
    private sharedService:SharedService,
    private router: Router, 
    ) {
      this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
      this.correoValido = Mensajes.CORREO_VALIDO;
      this.telefonoLongitud = Mensajes.TELEFONO_LONGITUD;
      this.soloNumeros = Mensajes.SOLO_NUMEROS;
    }

  ngOnInit() {
    console.log("CENTRO DETALLE Comp")

    if(this.authService.validarSesionActiva()){
      this.rol = this.cifradoService.getDecryptedRol();

      if(this.rol != "sop"){ 
        this.router.navigate(['/pagina/404/no-encontrada']);
      }else{
        this.formularioCentro = this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
          correo: ['', Validators.compose([
            //Validators.required, 
            Validators.email
          ])],
          direccion: ['', [Validators.required, Validators.minLength(3)]]
        })
    
        /*this.activatedRoute.params.subscribe(params => {
          this.id = params['id'];
          this.cargarCentro(this.id)
          
        });*/
    
        this.centroService.currentCentroId.subscribe((idCentroService) => {
          this.id = idCentroService;
          this.cargarCentro(this.id)
        });
      }
    }else{
      this.router.navigate(['/pagina/404/no-encontrada'])
    }
  }

  cargarCentro(id_centro:string){
    this.centroService.getCentro$(id_centro).subscribe(
      res => {
        this.centro = res;
        console.log("id Centro obtenido:" + res.id)

        this.formularioCentro.patchValue({
          correo: this.centro.correo,
          nombre: this.centro.nombre,
          telefono: this.centro.telefono,
          direccion: this.centro.direccion
        });

      },
      err => console.log("error: " + err)
    )
  }

  getInputClass(controlName: string) {
    const control = this.formularioCentro.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  updateCentro(): boolean {
    this.centroService.updateCentro(
      this.centro.id, 
      this.formularioCentro.value.nombre,
      this.formularioCentro.value.telefono,
      this.formularioCentro.value.correo,
      this.formularioCentro.value.direccion
      )
      .subscribe(res => {
        console.log("Centro actualizado: "+res);

        this.modalService.dismissAll()
        this.centroService.changeCentroId('success') //Regresamos el idCentro
        this.sharedService.setNombreClinica(this.formularioCentro.value.nombre);
        Swal.fire({
          icon: 'success',
          html:
            `<strong>${ this.centro.nombre }</strong><br/>` +
            '¡Información actualizada!',
          showConfirmButton: false,
          //confirmButtonColor: '#28a745',
          timer: 2000
        })

      },
        err => {
          console.log("error: " + err)
          Swal.fire({
            icon: 'error',
            html:
              `<strong>¡${ err.error.message }!</strong>`,
            showConfirmButton: true,
            confirmButtonColor: '#28a745',
            timer: 4000
          })
        }
      
      );

    return false;
  }
}
