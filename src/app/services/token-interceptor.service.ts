import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CifradoService } from './cifrado.service';
import { catchError, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from '../components/logout/logout.component';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private modalService: NgbModal
    //private cifradoService: CifradoService,
    //private cookieService: CookieService
  ) { }

  /*intercept(req, next){
    //console.log("obteniendo token: " +this.authService.getToken())
    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.cifradoService.getDecryptedToken()}`
      }
    })
    return next.handle(tokenizeReq)
  }*/

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Llama al método logout del AuthService
          
          //this.authService.cleanSesion();
          
          //alert('Tu sesión ha expirado. Por favor, inicie sesión nuevamente.');
          // Aquí podrías redirigir a la página de inicio de sesión si es necesario

          this.openSessionExpiredModal();
        }
        return throwError(() => error); // Cambia aquí para usar el nuevo formato
      })
    );
  }


  private openSessionExpiredModal() {
    const modalRef = this.modalService.open(LogoutComponent);
    modalRef.result.then(
        (result) => {
            // Puedes manejar el resultado del modal aquí si es necesario
        },
        (reason) => {
            // Manejar el cierre del modal si es necesario
        }
    );
  }
}
