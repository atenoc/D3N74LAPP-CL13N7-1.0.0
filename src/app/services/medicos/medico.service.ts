import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  URI = environment.urlApiMedicos;
  private medicos = new BehaviorSubject<Usuario[]>([]);

  constructor(private http: HttpClient) { }

  getMedicos$(id_clinica:string): Observable<Usuario[]>{
    this.http.get<Usuario[]>(`${this.URI}/id_clinica/${id_clinica}`).subscribe(
      res=>{
        this.medicos.next(res)
      },
      err => console.log(err)
    )
    return this.medicos.asObservable();
  }
}
