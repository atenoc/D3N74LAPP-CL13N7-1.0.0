import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../../login/login.component';
import { HomeComponent } from '../../home/home.component';
import { AuthGuard } from '../../../auth.guard';
import { UsuariosListComponent } from '../../usuarios/usuarios-list/usuarios-list.component';
import { AgendaComponent } from '../../agenda/agenda.component';
import { UsuarioFormComponent } from '../../usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from '../../usuarios/usuario-detalle/usuario-detalle.component';
import { CentroListComponent } from '../../centros/centro-list/centro-list.component';
import { CentroFormComponent } from '../../centros/centro-form/centro-form.component';
import { CentroDetalleComponent } from '../../centros/centro-detalle/centro-detalle.component';
import { PerfilComponent } from '../../perfil/perfil.component';
import { ContrasenaComponent } from '../../usuarios/usuario-detalle/contrasena/contrasena.component';
import { PageNotFoundComponent } from '../../../shared/page-not-found/page-not-found.component';
import { ConfigPerfilUsuarioComponent } from '../../perfil/config-perfil-usuario/config-perfil-usuario.component';
import { CalendarioComponent } from '../../calendario/calendario.component';
import { CitaFormComponent } from '../../calendario/cita-form/cita-form.component';
import { MedicosListComponent } from '../../medicos/medicos-list/medicos-list.component';
import { PacientesListComponent } from '../../pacientes/pacientes-list/pacientes-list.component';
import { CitaEditComponent } from '../../calendario/cita-edit/cita-edit.component';
import { CitasListComponent } from '../../calendario/citas-list/citas-list.component';
import { PacienteDetalleComponent } from '../../pacientes/paciente-detalle/paciente-detalle.component';
import { PacienteFormComponent } from '../../pacientes/paciente-form/paciente-form.component';
import { PlanesListComponent } from '../../planes/planes-list/planes-list.component';
import { DiagnosticoTratamientoPagoComponent } from './diagnostico-tratamiento-pago.component';

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
  {path:'agenda', component: AgendaComponent, canActivate:[AuthGuard]},
  {path:'calendario', component: CalendarioComponent, canActivate:[AuthGuard]},
  {path:'cita-form', component: CitaFormComponent, canActivate:[AuthGuard]},
  {path:'cita-edit/:id', component: CitaEditComponent, canActivate:[AuthGuard]},
  {path:'citas', component: CitasListComponent, canActivate:[AuthGuard]},
  {path:'diagnostico-tratamiento', component: DiagnosticoTratamientoPagoComponent, canActivate:[AuthGuard]},
  {path:'centros', component: CentroListComponent, canActivate:[AuthGuard]},
  {path:'centro-form', component: CentroFormComponent, canActivate:[AuthGuard]},
  {path:'centro-detalle/:id', component: CentroDetalleComponent, canActivate:[AuthGuard]},
  {path:'perfil', component: PerfilComponent, canActivate:[AuthGuard]},
  {path:'planes', component: PlanesListComponent, canActivate:[AuthGuard]},
  {path:'password/:id', component: ContrasenaComponent, canActivate:[AuthGuard]},
  {path:'pagina/404/no-encontrada', component: PageNotFoundComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
