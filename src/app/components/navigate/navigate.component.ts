import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {

  usuario: string

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit() {
    this.authService.mensajeActual.subscribe(usuario => this.usuario = usuario)
  }

}
