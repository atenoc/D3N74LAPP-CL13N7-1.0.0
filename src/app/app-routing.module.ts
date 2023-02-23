import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './auth.guard';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './components/usuarios/usuario-detalle/usuario-detalle.component';
import { CentroListComponent } from './components/centros/centro-list/centro-list.component';
import { CentroFormComponent } from './components/centros/centro-form/centro-form.component';
import { CentroDetalleComponent } from './components/centros/centro-detalle/centro-detalle.component';


const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'registro', component: RegistroComponent},
  {path:'login', component: LoginComponent},
  {path:'usuarios', component: UsuariosListComponent, canActivate:[AuthGuard]},
  {path:'usuario-form', component: UsuarioFormComponent, canActivate:[AuthGuard]},
  {path:'usuario-detalle/:id', component: UsuarioDetalleComponent, canActivate:[AuthGuard]},
  {path:'agenda', component: AgendaComponent, canActivate:[AuthGuard]},
  {path:'centros', component: CentroListComponent, canActivate:[AuthGuard]},
  {path:'centro-form', component: CentroFormComponent, canActivate:[AuthGuard]},
  {path:'centro-detalle/:id', component: CentroDetalleComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
