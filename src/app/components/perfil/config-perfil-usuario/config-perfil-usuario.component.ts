import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CentroService } from 'src/app/services/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { CifradoService } from 'src/app/services/shared/cifrado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mensajes } from 'src/app/shared/mensajes.config';
import Swal from 'sweetalert2';
declare var require: any;

@Component({
  selector: 'app-config-perfil-usuario',
  templateUrl: './config-perfil-usuario.component.html',
  styleUrls: ['./config-perfil-usuario.component.css']
})
export class ConfigPerfilUsuarioComponent implements OnInit {

  nombre:string
  apellido:string
  nombreClinica:string
  telefono:string
  direccionClinica:string

  formularioCentro:FormGroup

  date: Date;
  fecha_creacion:string

  constructor(
    private centroService:CentroService, 
    private router:Router,
    private usuarioService:UsuarioService,
    private sharedService:SharedService,
    private cifradoService: CifradoService,
    ) { }

  ngOnInit(): void {
    console.log("CONFIG PERFIL U Component")
    this.noBack()
    require('../../../../assets/js/custom-wizard.js');

    this.centroService.getCentroByIdUser$(localStorage.getItem('_us')).subscribe(
      res => {
        console.log("Si existe Centro")
        this.router.navigate(['/calendario'])
      },
      err => {
        console.log("No existe Centro")
        console.log(err)
        this.router.navigate(['/configuracion/perfil/usuario'])
      }
    )
  }

  noBack(){
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function(event) {
        window.history.pushState(null, null, window.location.href);
    };
  }

  validarInfo(){
    console.log("Validando info")

    this.date = new Date();
    const mes = this.date.getMonth()+1;
    this.fecha_creacion = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"

    if(this.nombre ==="" || this.apellido ==="" || this.nombreClinica ==="" || this.telefono.length !=10 || this.direccionClinica ===""){
      Swal.fire({
        icon: 'warning',
        html:
          `<strong> ${ Mensajes.WARNING } </strong><br/>` +
          `<span>${ Mensajes.REGISTRO_VALIDACION }</span>`,
        showConfirmButton: false,
        timer: 2000
      })
      return
    }

    const centroJson = {
      id_usuario: localStorage.getItem('_us'),
      nombre: this.nombreClinica,
      telefono: this.telefono,
      direccion: this.direccionClinica,
      fecha_creacion: this.fecha_creacion,
      id_plan: '0401PF30'
    };

    console.log("Centro a insertar")
    console.log(centroJson)

    const usuarioJson = {
      id: localStorage.getItem('_us'),
      nombre: this.nombre,
      apellido: this.apellido
    };

    console.log("Usuario a actualizar ")
    //console.log(usuarioJson)

    this.centroService.createCentro(centroJson).subscribe(
      res =>{
        console.log("Clínica registrada correctamente, id:: "+res.id)
        //console.log("Clínica, id plan:: "+res.id_plan)
        localStorage.setItem('_cli', res.id)
        this.cifradoService.setEncryptedIdPlan(res.id_plan)

        this.usuarioService.updateUsuarioRegister(localStorage.getItem('_us'), this.nombre, this.apellido, res.id, this.fecha_creacion).subscribe(
          res=>{

            this.router.navigate(['/perfil'])
            Swal.fire({
              title: `${ Mensajes.SUCCESS }`,
              icon: 'success',
              html:
                `<strong>${ Mensajes.REGISTRO_EXITOSO }</strong></br>`,
              showConfirmButton: true,
              confirmButtonColor: '#28a745',
              timer: 4000
            })
            console.log("Usuario actualizado")
            this.sharedService.setNombreUsuario(this.nombre +" "+this.apellido)
            this.sharedService.setNombreClinica(this.nombreClinica);
            this.sharedService.setMensajeVigenciaPlanGratuito("Prueba gratis por 30 días");
            this.sharedService.setDiasRestantesPlanGratuito('30');
            localStorage.setItem('dias_restantes_p_g', '30')
          },
          err =>{
            console.log("Error al actualizar el usuario")
            console.log(err)
          }
        )
  
      },
      err =>{
        Swal.fire({
          icon: 'error',
          html:
            `<strong>${ Mensajes.ERROR_500 }</strong></br>`+
            `<span>${ Mensajes.REGISTRO_ERROR }</span></br>`+
            `<small>${ Mensajes.INTENTAR_MAS_TARDE }</small>`,
          showConfirmButton: false,
          timer: 3000
        }) 
        console.log("Ocurrió un error al registrar la clínica")
        console.log(err)
      }
    )
  }

}