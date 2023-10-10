import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CifradoService {

  secretKey = environment.secretKey;

  constructor() { }

  // Método para cifrar y guardar el token
  setEncryptedToken(token: string): void {
    //console.log("Llegó aqui: " +token)
    const encryptedToken = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    localStorage.setItem('_enc_tk', encryptedToken);
  }

  // Método para obtener y descifrar el token
  getDecryptedToken(): string | null {
    const encryptedToken = localStorage.getItem('_enc_tk');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      //console.log("token  des:: "+bytes.toString(CryptoJS.enc.Utf8))
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  setEncryptedRol(rol: string): void {
    //console.log("Llegó aqui: " +token)
    const encryptedRol = CryptoJS.AES.encrypt(rol, this.secretKey).toString();
    localStorage.setItem('_lor_', encryptedRol);
  }

  getDecryptedRol(): string | null {
    const encryptedRol = localStorage.getItem('_lor_');
    if (encryptedRol) {
      const bytes = CryptoJS.AES.decrypt(encryptedRol, this.secretKey);
      //console.log("token  des:: "+bytes.toString(CryptoJS.enc.Utf8))
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }
}
