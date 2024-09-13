import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CentroService } from 'src/app/services/clinicas/centro.service';
import { SharedService } from 'src/app/services/shared.service';
import { CifradoService } from 'src/app/services/cifrado.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { Mensajes } from 'src/app/shared/utils/mensajes.config';
import { Alerts } from 'src/app/shared/utils/alerts';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtil } from 'src/app/shared/utils/DateUtil';
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
  //fecha_actual:string

  constructor(
    private centroService:CentroService, 
    private router:Router,
    private spinner: NgxSpinnerService,
    private usuarioService:UsuarioService,
    private sharedService:SharedService,
    private cifradoService: CifradoService,
    ) { }

  ngOnInit(): void {
    console.log("CONFIG PERFIL U Component")
    this.noBack()
    require('../../../../assets/js/custom-wizard.js');

    this.centroService.getCentroByIdUserSuAdmin(localStorage.getItem('_us')).subscribe(
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

    if(this.nombre ==="" || this.apellido ==="" || this.nombreClinica ==="" || this.telefono.length !=10 || this.direccionClinica ===""){
      Alerts.warning(Mensajes.WARNING, Mensajes.REGISTRO_VALIDACION);

      return
    }

    const centroJson = {
      id_usuario_creador: localStorage.getItem('_us'),
      nombre: this.nombreClinica,
      telefono: this.telefono,
      direccion: this.direccionClinica,
      fecha_creacion: DateUtil.getCurrentFormattedDate(),
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

    this.spinner.show();
    this.centroService.createCentro(centroJson).subscribe(
      res =>{
        console.log("Clínica registrada correctamente, id:: "+res.id)
        //console.log("Clínica, id plan:: "+res.id_plan)
        localStorage.setItem('_cli', res.id)
        this.cifradoService.setEncryptedIdPlan(res.id_plan)

        this.spinner.show();
        this.usuarioService.updateUsuarioRegister(localStorage.getItem('_us'), this.nombre, this.apellido, res.id).subscribe(
          res=>{
            this.spinner.hide();
            const id = localStorage.getItem('_us');
            this.router.navigate(['/perfil/', id]);
  
            console.log("Usuario actualizado")
            this.sharedService.setNombreUsuario(this.nombre +" "+this.apellido)
            this.sharedService.setNombreClinica(this.nombreClinica);
            this.sharedService.setMensajeVigenciaPlanGratuito("Prueba gratis por 30 días");
            this.sharedService.setDiasRestantesPlanGratuito('30');
            localStorage.setItem('dias_restantes_p_g', '30')

            Alerts.successCenter(Mensajes.SUCCESS, `${Mensajes.REGISTRO_EXITOSO}`);
          },
          err =>{
            this.spinner.hide();
            console.log("Error al actualizar el usuario")
            console.log(err)
            Alerts.error(Mensajes.ERROR_500, Mensajes.REGISTRO_ERROR, Mensajes.INTENTAR_MAS_TARDE);
          }
        )
  
      },
      err =>{
        this.spinner.hide();
        console.log("Ocurrió un error al registrar la clínica")
        console.log(err)
        Alerts.error(Mensajes.ERROR_500, Mensajes.REGISTRO_ERROR, Mensajes.INTENTAR_MAS_TARDE);
      }
    )
  }

}