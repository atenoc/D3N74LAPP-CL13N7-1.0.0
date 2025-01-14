import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public notifyApp: EventEmitter<any> = new EventEmitter();

  private cambiarContrasena = new BehaviorSubject<boolean>(true);
  private nombreClinica = new BehaviorSubject<string>('');
  private nombreUsuario = new BehaviorSubject<string>('');
  private nombreCompletoUsuario = new BehaviorSubject<string>('');
  private diasRestanPlanGratis = new BehaviorSubject<string>('');
  private mensajeVigenciaPlan = new BehaviorSubject<string>('');

  private image = new BehaviorSubject<string>('');
  private imageURL = new BehaviorSubject<string>('');

  private objetoDiagnostico = new BehaviorSubject<any>(null);

  constructor() { }

  getCambiarContrasena() {
    return this.cambiarContrasena.asObservable();
  }
  //setData(valor: boolean) {
    //this.cambiarContrasena.next(valor);
  //}

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

  getNombreCompletoUsuario() {
    return this.nombreCompletoUsuario.asObservable();
  }
  setNombreCompletoUsuario(nombreCompletoUsuario: string) {
    this.nombreCompletoUsuario.next(nombreCompletoUsuario);
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

  /* Imagen desde canvas */
  getImage() {
    return this.image.asObservable();
  }
  setImage(valor: string) {
    this.image.next(valor);
  }

   /* Desde canvas a FORM Diagnosticos*/
  getImageURL() {
    return this.imageURL.asObservable();
  }
  setImageURL(url: string) {
    this.imageURL.next(url);
  }

  // Para el objeto Diagnostico
  getObjetoDiagnostico() {
    return this.objetoDiagnostico.asObservable();
  }
  setObjetoDiagnostico(objeto: any) { 
    this.objetoDiagnostico.next(objeto);
  }
}
