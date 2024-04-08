import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  isDarkMode = false;
  menuOculto = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Obtén la referencia al elemento body
    const body = document.body;

    // Agrega o elimina la clase 'dark-mode' según el estado actual
    if (this.isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
    }
  }

  toggleMenuOculto() {
    this.menuOculto = !this.menuOculto;

    // Obtén la referencia al elemento body
    const body = document.body;

    // Agrega o elimina la clase 'dark-mode' según el estado actual
    if (this.menuOculto) {
      this.renderer.addClass(body, 'sidebar-collapse');
      this.renderer.removeClass(body, 'sidebar-mini');
    } else {
      this.renderer.removeClass(body, 'sidebar-collapse');
    }
  }
}
