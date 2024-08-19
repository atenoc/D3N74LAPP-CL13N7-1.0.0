import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {

  URI = environment.urlApiUploads

  constructor(private http: HttpClient) { }

  uploadImage(uploadData : any): Observable<any> {
    return this.http.post<any>(`${this.URI}`, uploadData);
  }
}
