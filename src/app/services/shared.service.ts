import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public notifyApp: EventEmitter<any> = new EventEmitter();

  //private messageSource = new BehaviorSubject<string>('') 
  //mensajeActual = this.messageSource.asObservable()

  private cambiarContrasena = new BehaviorSubject<boolean>(true);
  private nombreClinica = new BehaviorSubject<string>('');
  private nombreUsuario = new BehaviorSubject<string>('');
  private diasRestanPlanGratis = new BehaviorSubject<string>('');
  private mensajeVigenciaPlan = new BehaviorSubject<string>('');

  constructor() { }

  /*cambiarMensaje(message: string){
    this.messageSource.next(message)
  }*/

  getCambiarContrasena() {
    return this.cambiarContrasena.asObservable();
  }
  setData(valor: boolean) {
    this.cambiarContrasena.next(valor);
  }

  getNombreClinica() {
    return this.nombreClinica.asObservable();
  }
  setNombreClinica(nombre: string) {
    this.nombreClinica.next(nombre);
  }

  getNombreUsuario() {
    return this.nombreUsuario.asObservable();
  }
  setNombreUsuario(nombreUsuario: string) {
    this.nombreUsuario.next(nombreUsuario);
  }


  getMensajeVigenciaPlanGratuito() {
    return this.mensajeVigenciaPlan.asObservable();
  }
  setMensajeVigenciaPlanGratuito(valor: string) {
    this.mensajeVigenciaPlan.next(valor);
  }


  getDiasRestantesPlanGratuito() {
    return this.diasRestanPlanGratis.asObservable();
  }
  setDiasRestantesPlanGratuito(dias: string) {
    this.diasRestanPlanGratis.next(dias);
  }
}
