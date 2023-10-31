import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './components/usuarios/usuario-detalle/usuario-detalle.component';
import { CentroListComponent } from './components/centros/centro-list/centro-list.component';
import { CentroFormComponent } from './components/centros/centro-form/centro-form.component';
import { CentroDetalleComponent } from './components/centros/centro-detalle/centro-detalle.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ContrasenaComponent } from './components/usuarios/usuario-detalle/contrasena/contrasena.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ConfigPerfilUsuarioComponent } from './components/perfil/config-perfil-usuario/config-perfil-usuario.component';
import { CalendarioComponent } from './components/calendario/calendario.component';


const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'configuracion/perfil/usuario', component: ConfigPerfilUsuarioComponent, canActivate:[AuthGuard]},
  {path:'usuarios', component: UsuariosListComponent, canActivate:[AuthGuard]},
  {path:'usuario-form', component: UsuarioFormComponent, canActivate:[AuthGuard]},
  {path:'usuario-detalle/:id', component: UsuarioDetalleComponent, canActivate:[AuthGuard]},
  {path:'agenda', component: AgendaComponent, canActivate:[AuthGuard]},
  {path:'calendario', component: CalendarioComponent, canActivate:[AuthGuard]},
  {path:'centros', component: CentroListComponent, canActivate:[AuthGuard]},
  {path:'centro-form', component: CentroFormComponent, canActivate:[AuthGuard]},
  {path:'centro-detalle/:id', component: CentroDetalleComponent, canActivate:[AuthGuard]},
  {path:'perfil', component: PerfilComponent, canActivate:[AuthGuard]},
  {path:'password/:id', component: ContrasenaComponent, canActivate:[AuthGuard]},
  {path:'pagina/404/no-encontrada', component: PageNotFoundComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
