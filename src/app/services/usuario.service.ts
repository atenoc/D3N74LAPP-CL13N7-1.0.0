import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Usuario, UsuariosPaginados } from '../models/Usuario.model';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  URI = environment.urlApiUsuarios

  private usuario = new BehaviorSubject<Usuario>(null);
  private usuarios = new BehaviorSubject<Usuario[]>([]);
  private usuarioCreado:Usuario 
  private usuario$: Subject<Usuario>; // Para actualizar la info del usuario en el navigate

  constructor(private http: HttpClient) {
    this.usuario$ = new Subject();
  }

  // POST
  createUsuario(user): Observable<Usuario> {
    return this.http.post<Usuario>(this.URI, user).pipe(
      map(response => {
        // Crear un nuevo objeto de usuario a partir de la respuesta del servidor
        this.usuarioCreado = response
        
        // Agregar el usuario recién creado a la lista de usuarios
        // const newUsuarios = [...this.usuarios.getValue(), this.usuarioCreado];
        
        // Agregar el usuario recién creado al principio de la lista de usuarios
        const newUsuarios = [this.usuarioCreado, ...this.usuarios.getValue()];
        this.usuarios.next(newUsuarios);
  
        // Actualizar el usuario BehaviorSubject con el usuario recién creado
        this.usuario.next(this.usuarioCreado);
  
        // Devolver el objeto de usuario recién creado
        return this.usuarioCreado;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }
  
  // GET
  getUsuarios$(): Observable<Usuario[]>{
    this.http.get<Usuario[]>(this.URI).subscribe(
      res=>{
        this.usuarios.next(res)
      },
      err => console.log(err)
    )
    return this.usuarios.asObservable();
  }

  // GET Usuarios Paginado
  getUsuariosPaginados$(
    page: number,
    size: number,
    orderBy: string,
    way: string
  ): Observable<UsuariosPaginados> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('orderBy', String(orderBy))
      .set('way', String(way));
  
    return this.http.get<UsuariosPaginados>(`${this.URI}/pagination`, { params });
  }

  // GET
  getUsuario$(id: string){
    return this.http.get<Usuario>(`${this.URI}/${id}`)
  }

  // PATCH
  updateUsuario(id: string, correo: string, llave: string, rol:string, titulo:string, nombre:string, apellidop:string, apellidom:string, especialidad:string, telefono:string) {
    return this.http.patch(`${this.URI}/${id}`, {correo, llave, rol, titulo, nombre, apellidop, apellidom, especialidad, telefono});
  }

  // DELETE
  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URI}/${id}`).pipe(
      tap(() => {
        const usuarios = this.usuarios.getValue();
        const index = usuarios.findIndex(usuario => usuario.id === id);
        if (index !== -1) {
          usuarios.splice(index, 1);
          this.usuarios.next([...usuarios]);
        }
      })
    );
  }
  
  // GET One by - Login / Navigate
  getUsuarioByCorreo$(correo: string) {
    if(correo){
      this.http.get<Usuario>(`${this.URI}/usuarioxcorreo/${correo}`).subscribe(
        res=>{
          this.usuario$.next(res)
        },
        err => console.log(err)
      )
      return this.usuario$.asObservable();
    }else{
      return this.usuario$;
    }
  }

  validarUsuarioActivo$(id: string, correo: string) {
    if (id && correo) {
      return this.http.get<Usuario>(`${this.URI}/usuario/${id}/${correo}`).pipe(
        catchError((err) => {
          //console.log(err); 
          return throwError(err); // Lanzar el error nuevamente para que lo maneje el componente
        })
      );
    } else {
      return this.usuario$;
    }
  }

  /*getUsuarioById$(id: string) {
    if(id){
      this.http.get<Usuario>(`${this.URI}/usuarioxid/${id}`).subscribe(
        res=>{
          this.usuario$.next(res)
        },
        err => console.log(err)
      )
      return this.usuario$.asObservable();
    }else{
      return this.usuario$;
    }
  }*/

  // GET All by
  getUsuariosByUsuario$(id:string): Observable<Usuario[]>{
    this.http.get<Usuario[]>(`${this.URI}/usuario/${id}`).subscribe(
      res=>{
        this.usuarios.next(res)
      },
      err => console.log(err)
    )
    return this.usuarios.asObservable();
  }

  // GET Usuarios Paginado
  getUsuariosByUsuarioPaginados$(
    id:string,
    page: number,
    size: number,
    orderBy: string,
    way: string
  ): Observable<UsuariosPaginados> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('orderBy', String(orderBy))
      .set('way', String(way));
  
    return this.http.get<UsuariosPaginados>(`${this.URI}/usuario/${id}`, { params });
  }

  updateUsuarioLlave(id: string, llave: string){
    return this.http.patch(`${this.URI}/passwordusuario/${id}`, { llave });
  }

}
