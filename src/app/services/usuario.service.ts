import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  URI = 'http://localhost:4000/api/usuarios';

  constructor(private http: HttpClient, private router:Router) { }

  createUsuario(user) {
    return this.http.post<any>(this.URI, user)
  }

  getUsuarios() {
    return this.http.get<Usuario[]>(this.URI);
  }

  getUsuario(id: string) {
    return this.http.get<Usuario>(`${this.URI}/${id}`);
  }

  deleteUsuario(id: string) {
    return this.http.delete(`${this.URI}/${id}`);
  }

  updateUsuario(id: string, correo: string, llave: string, rol:string) {
    return this.http.patch(`${this.URI}/${id}`, {correo, llave, rol});
  }

}
