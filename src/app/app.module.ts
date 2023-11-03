import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavigateComponent } from './components/navigate/navigate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HomeComponent } from './components/home/home.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './components/usuarios/usuario-detalle/usuario-detalle.component';
import { CentroListComponent } from './components/centros/centro-list/centro-list.component';
import { CentroFormComponent } from './components/centros/centro-form/centro-form.component';
import { CentroDetalleComponent } from './components/centros/centro-detalle/centro-detalle.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './shared/footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ContrasenaComponent } from './components/usuarios/usuario-detalle/contrasena/contrasena.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ConfigPerfilUsuarioComponent } from './components/perfil/config-perfil-usuario/config-perfil-usuario.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DetalleEventoComponent } from './components/calendario/detalle-evento/detalle-evento.component';
import { FormEventoComponent } from './components/calendario/form-evento/form-evento.component';
import { CitaFormComponent } from './components/calendario/cita-form/cita-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigateComponent,
    HomeComponent,
    AgendaComponent,
    UsuariosListComponent,
    UsuarioFormComponent,
    UsuarioDetalleComponent,
    CentroListComponent,
    CentroFormComponent,
    CentroDetalleComponent,
    PerfilComponent,
    FooterComponent,
    ContrasenaComponent,
    HeaderComponent,
    SidebarComponent,
    PageNotFoundComponent,
    ConfigPerfilUsuarioComponent,
    CalendarioComponent,
    DetalleEventoComponent,
    FormEventoComponent,
    CitaFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    FullCalendarModule,
    NgbTimepickerModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
