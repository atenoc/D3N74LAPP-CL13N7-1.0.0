import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HomeComponent } from './components/home/home.component';
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
import { CalendarioComponent } from './components/calendario/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DetalleEventoComponent } from './components/calendario/detalle-evento/detalle-evento.component';
import { CitaFormComponent } from './components/calendario/cita-form/cita-form.component';
import { MedicosListComponent } from './components/medicos/medicos-list/medicos-list.component';
import { PacientesListComponent } from './components/pacientes/pacientes-list/pacientes-list.component';
import { CitaEditComponent } from './components/calendario/cita-edit/cita-edit.component';
import { CitasListComponent } from './components/calendario/agenda/citas-list.component';
import { PacienteDetalleComponent } from './components/pacientes/paciente-detalle/paciente-detalle.component';
import { PacienteFormComponent } from './components/pacientes/paciente-form/paciente-form.component';
import { EventFormComponent } from './components/calendario/event-form/event-form.component';
import { SettingComponent } from './shared/setting/setting.component';
import { PlanesListComponent } from './components/planes/planes-list/planes-list.component';
import { ExpedienteComponent } from './components/expediente/expediente.component';
import { HistoriaComponent } from './components/expediente/historia/historia.component';
import { DiagnosticoComponent } from './components/expediente/diagnostico/diagnostico.component';
import { TratamientoComponent } from './components/expediente/tratamiento/tratamiento.component';
import { SeguimientoComponent } from './components/expediente/seguimiento/seguimiento.component';
import { VisitasComponent } from './components/expediente/visitas/visitas.component';
import { Visor3dComponent } from './shared/visor3d/visor3d.component';
import { VisorCanvasComponent } from './shared/visor-canvas/visor-canvas.component';
import { ImageViewerComponent } from './shared/image-viewer/image-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
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
    CitaFormComponent,
    MedicosListComponent,
    PacientesListComponent,
    CitaEditComponent,
    CitasListComponent,
    PacienteDetalleComponent,
    PacienteFormComponent,
    EventFormComponent,
    SettingComponent,
    PlanesListComponent,
    ExpedienteComponent,
    HistoriaComponent,
    DiagnosticoComponent,
    TratamientoComponent,
    SeguimientoComponent,
    VisitasComponent,
    Visor3dComponent,
    VisorCanvasComponent,
    ImageViewerComponent
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
