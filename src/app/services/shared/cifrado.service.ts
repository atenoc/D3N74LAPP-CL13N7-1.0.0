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
    localStorage.setItem('_enc_t', encryptedToken);
  }

  // Método para obtener y descifrar el token
  getDecryptedToken(): string | null {
    const encryptedToken = localStorage.getItem('_enc_t');
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

  getEncryptedPassword(llave: string): string | null {
    const encryptedLlave = CryptoJS.AES.encrypt(llave, this.secretKey).toString();
    return encryptedLlave;
  }


  setEncryptedIdPlan(id_plan: string): void {
    console.log("Valor a encriptar: "+id_plan)
    const encryptedRol = CryptoJS.AES.encrypt(id_plan, this.secretKey).toString();
    localStorage.setItem('_plan', encryptedRol);
  }

  getDecryptedIdPlan(): string | null {
    const encryptedRol = localStorage.getItem('_plan');
    if (encryptedRol) {
      console.log("Vamos a desencriptar...")
      const bytes = CryptoJS.AES.decrypt(encryptedRol, this.secretKey);
      console.log("Valor desencriptado: "+bytes.toString(CryptoJS.enc.Utf8))
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }
}
