import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './components/usuarios/usuario-detalle/usuario-detalle.component';
import { CentroListComponent } from './components/centros/centro-list/centro-list.component';
import { CentroFormComponent } from './components/centros/centro-form/centro-form.component';
import { CentroDetalleComponent } from './components/centros/centro-detalle/centro-detalle.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ContrasenaComponent } from './components/usuarios/usuario-detalle/contrasena/contrasena.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ConfigPerfilUsuarioComponent } from './components/perfil/config-perfil-usuario/config-perfil-usuario.component';
import { CalendarioComponent } from './components/calendario/calendario/calendario.component';
import { CitaFormComponent } from './components/calendario/cita-form/cita-form.component';
import { MedicosListComponent } from './components/medicos/medicos-list/medicos-list.component';
import { PacientesListComponent } from './components/pacientes/pacientes-list/pacientes-list.component';
import { CitaEditComponent } from './components/calendario/cita-edit/cita-edit.component';
import { CitasListComponent } from './components/calendario/agenda/citas-list.component';
import { PacienteDetalleComponent } from './components/pacientes/paciente-detalle/paciente-detalle.component';
import { PacienteFormComponent } from './components/pacientes/paciente-form/paciente-form.component';
import { PlanesListComponent } from './components/planes/planes-list/planes-list.component';
import { ExpedienteComponent } from './components/expediente/expediente.component';
import { VisitasComponent } from './components/expediente/visitas/visitas.component';
import { DiagnosticoComponent } from './components/expediente/diagnostico/diagnostico.component';
import { TratamientoComponent } from './components/expediente/tratamiento/tratamiento.component';
import { Visor3dComponent } from './shared/visor3d/visor3d.component';
import { VisorCanvasComponent } from './shared/visor-canvas/visor-canvas.component';

const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'configuracion/perfil/usuario', component: ConfigPerfilUsuarioComponent, canActivate:[AuthGuard]},
  {path:'usuarios', component: UsuariosListComponent, canActivate:[AuthGuard]},
  {path:'usuario-form', component: UsuarioFormComponent, canActivate:[AuthGuard]},
  {path:'usuario-detalle/:id', component: UsuarioDetalleComponent, canActivate:[AuthGuard]},
  {path:'medicos', component: MedicosListComponent, canActivate:[AuthGuard]},
  {path:'pacientes', component: PacientesListComponent, canActivate:[AuthGuard]}, 
  {path:'paciente-form', component: PacienteFormComponent, canActivate:[AuthGuard]},
  {path:'paciente-detalle/:id', component: PacienteDetalleComponent, canActivate:[AuthGuard]},
  {path:'calendario', component: CalendarioComponent, canActivate:[AuthGuard]},
  {path:'cita-form', component: CitaFormComponent, canActivate:[AuthGuard]},
  {path:'cita-edit/:id', component: CitaEditComponent, canActivate:[AuthGuard]},
  {path:'agenda', component: CitasListComponent, canActivate:[AuthGuard]},
  {path:'expediente/paciente/:id', component: ExpedienteComponent, canActivate:[AuthGuard]},
  {path:'centros', component: CentroListComponent, canActivate:[AuthGuard]},
  {path:'centro-form', component: CentroFormComponent, canActivate:[AuthGuard]},
  {path:'centro-detalle/:id', component: CentroDetalleComponent, canActivate:[AuthGuard]},
  {path:'perfil/:id', component: PerfilComponent, canActivate:[AuthGuard]},
  {path:'visitas/:id', component: VisitasComponent, canActivate:[AuthGuard]},
  {path:'diagnosticos/:id', component: DiagnosticoComponent, canActivate:[AuthGuard]},
  {path:'tratamientos/:id', component: TratamientoComponent, canActivate:[AuthGuard]},
  {path:'planes', component: PlanesListComponent, canActivate:[AuthGuard]},
  {path:'password/:id', component: ContrasenaComponent, canActivate:[AuthGuard]},
  {path:'visor-3d', component: Visor3dComponent, canActivate:[AuthGuard]},
  {path:'area-dibujo', component: VisorCanvasComponent, canActivate:[AuthGuard]},
  {path:'pagina/404/no-encontrada', component: PageNotFoundComponent, canActivate:[AuthGuard]},
  {path:'**', component: PageNotFoundComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
