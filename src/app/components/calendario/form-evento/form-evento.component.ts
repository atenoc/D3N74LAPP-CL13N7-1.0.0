import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Mensajes } from 'src/app/shared/mensajes.config';

@Component({
  selector: 'app-form-evento',
  templateUrl: './form-evento.component.html',
  styleUrls: ['./form-evento.component.css']
})
export class FormEventoComponent implements OnInit {

  formularioEvento:FormGroup
  model: NgbDateStruct;

  //mensajes
  campoRequerido: string;

  constructor(
    private formBuilder:FormBuilder,
    private activeModal: NgbActiveModal
  ) { 
    this.campoRequerido = Mensajes.CAMPO_REQUERIDO;
  }

  ngOnInit(): void {
    this.formularioEvento = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      //start: ['', Validators.required],
      //motivo: ['', Validators.required],
    })
  }

  getInputClass(controlName: string) {
    const control = this.formularioEvento.get(controlName);
    return {
      'invalid-input': control?.invalid && control?.dirty
    };
  }

  limpiarForm(){
    this.formularioEvento.reset();
    console.log("Limpiando formulario")
  }

  closeModal() {
    this.activeModal.close('Modal cerrado');
  }

}
