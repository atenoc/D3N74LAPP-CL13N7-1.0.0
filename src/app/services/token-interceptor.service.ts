import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CifradoService } from './cifrado.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService, private cifradoService:CifradoService) { }

  intercept(req, next){
    //console.log("obteniendo token: " +this.authService.getToken())
    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.cifradoService.getDecryptedToken()}`
      }
    })
    return next.handle(tokenizeReq)
  }
}
