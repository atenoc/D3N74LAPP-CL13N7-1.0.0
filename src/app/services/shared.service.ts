import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public notifyApp: EventEmitter<any> = new EventEmitter();

  private messageSource = new BehaviorSubject<string>('') 
  mensajeActual = this.messageSource.asObservable()

  private data = new BehaviorSubject<boolean>(true);
  private dataString = new BehaviorSubject<string>('');
  private nombreUsuario = new BehaviorSubject<string>('');

  constructor() { }

  cambiarMensaje(message: string){
    this.messageSource.next(message)
  }

  setData(data: boolean) {
    this.data.next(data);
  }

  getData() {
    return this.data.asObservable();
  }

  getDataString() {
    return this.dataString.asObservable();
  }
  setDataString(dataString: string) {
    this.dataString.next(dataString);
  }

  
  getNombreUsuario() {
    return this.nombreUsuario.asObservable();
  }
  setNombreUsuario(nombreUsuario: string) {
    this.nombreUsuario.next(nombreUsuario);
  }
}
