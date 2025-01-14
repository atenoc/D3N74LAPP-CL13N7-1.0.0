import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Usuario, UsuariosPaginados } from '../../models/Usuario.model';
import { catchError, map, tap } from 'rxjs/operators';
import { DateUtil } from 'src/app/shared/utils/DateUtil';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  URI = environment.urlApiUsuarios

  private usuario = new BehaviorSubject<Usuario>(null);
  private usuarios = new BehaviorSubject<Usuario[]>([]);
  private usuarioCreado:Usuario 
  //private usuario$: Subject<Usuario>; // Para actualizar la info del usuario en el navigate

  constructor(private http: HttpClient) {
    //this.usuario$ = new Subject();
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
  
  getUsuarioSop$(){
    return this.http.get<Usuario[]>(`${this.URI}/roles/onlysop`)
  }

  // GET Usuario por id
  getUsuario$(id: string){
    return this.http.get<Usuario>(`${this.URI}/${id}`)
  }

  // PATCH
  updateUsuario(id: string, usuario:any) {
    usuario.id_usuario_actualizo = localStorage.getItem('_us')
    usuario.id_clinica = localStorage.getItem('_cli')
    usuario.fecha_actualizacion = DateUtil.getCurrentFormattedDate()
    return this.http.patch<Usuario>(`${this.URI}/${id}`, usuario);
  }

  /* No se envía id_usuario_creador en este método */
  updateUsuarioRegister(id: string, nombre:string, apellidop:string, id_clinica:string) {
    return this.http.patch(`${this.URI}/usuario/${id}/registro`, {nombre, apellidop, id_clinica});
  }

  // DELETE
  deleteUsuario(id: string) {
    const params = new HttpParams()
      .set('id_usuario_elimino', localStorage.getItem('_us'))
      .set('id_clinica', localStorage.getItem('_cli'))
      .set('fecha_eliminacion', DateUtil.getCurrentFormattedDate())
    return this.http.delete<void>(`${this.URI}/${id}`, { params });
  }
  
  // getUsusuario Paginados por id_usuario
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
  
    return this.http.get<UsuariosPaginados>(`${this.URI}/paginacion/usuario/${id}`, { params });
  }

  // getUsusuario Paginados por id_clinica
  getUsuariosByIdClinicaPaginados$(
    id_clinica:string,
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
  
    return this.http.get<UsuariosPaginados>(`${this.URI}/paginacion/clinica/${id_clinica}`, { params });
  }

  buscarMedicos(id_clinica: string, query: string, ): Observable<any> {
    return this.http.post(`${this.URI}/buscador/${id_clinica}`, { query });
  }

}
