import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  private messageSource = new BehaviorSubject<string>('') 
  mensajeActual = this.messageSource.asObservable()

  constructor() { }

  cambiarMensaje(message: string){
    this.messageSource.next(message)
  }
}
