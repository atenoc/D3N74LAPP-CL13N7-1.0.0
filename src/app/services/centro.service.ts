import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Centro } from '../models/Centro.model';

@Injectable({
  providedIn: 'root'
})
export class CentroService {

  //URI = 'http://localhost:4000/api/centros';
  URI = environment.urlApiCentros

  private centros$: Subject<Centro[]>;
  private centro$: Subject<Centro>;

  constructor(private http: HttpClient, private router:Router) {
    this.centros$ = new Subject();
    this.centro$ = new Subject();
   }

  createCentro(centro) {
    return this.http.post<any>(this.URI, centro)
  }

  getCentros$() {
    //return this.http.get<Centro[]>(this.URI);
    this.http.get<Centro[]>(this.URI).subscribe(
      res=>{
        this.centros$.next(res)
      },
      err => console.log(err)
    )
    return this.centros$.asObservable();
  }

  getCentro$(id: string) {
    //return this.http.get<Centro>(`${this.URI}/${id}`);
    this.http.get<Centro>(`${this.URI}/${id}`).subscribe(
      res=>{
        this.centro$.next(res)
      },
      err => console.log(err)
    )
    return this.centro$.asObservable();
  }

  deleteCentro(id: string) {
    return this.http.delete(`${this.URI}/${id}`);
  }

  updateCentro(id: string, nombre: string, telefono: string, correo:string, direccion:string) {
    return this.http.patch(`${this.URI}/${id}`, {nombre, telefono, correo, direccion});
  }

  getCentroByIdUser(id_usuario: string) {
    //return this.http.get<Centro>(`${this.URI}/usuario/${id_usuario}`);
    if(id_usuario){
      this.http.get<Centro>(`${this.URI}/usuario/${id_usuario}`).subscribe(
        res=>{
          //console.log("Respuesta Service: "+ JSON.stringify(res) )
          this.centro$.next(res)
        },
        err => console.log(err)
      )
      return this.centro$.asObservable();
    }else{
      return this.centro$
    }
    
  }
}
