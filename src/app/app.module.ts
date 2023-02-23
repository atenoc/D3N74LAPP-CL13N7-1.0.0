import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { NavigateComponent } from './components/navigate/navigate.component';
import { FormsModule } from '@angular/forms'
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

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    NavigateComponent,
    HomeComponent,
    AgendaComponent,
    UsuariosListComponent,
    UsuarioFormComponent,
    UsuarioDetalleComponent,
    CentroListComponent,
    CentroFormComponent,
    CentroDetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
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
