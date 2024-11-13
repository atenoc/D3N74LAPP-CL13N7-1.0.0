import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  }

  onClose() {
    this.activeModal.close('close'); // Emite 'close' al cerrar
  }

  onLogin() {
    this.activeModal.close('close'); // Emite 'close' al cerrar
    this.authService.cleanSesion();
  }

}
