import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrivateComponent } from './components/private/private.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './auth.guard';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './components/usuarios/usuario-detalle/usuario-detalle.component';


const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'registro', component: RegistroComponent},
  {path:'login', component: LoginComponent},
  {path:'usuarios', component: UsuariosListComponent, canActivate:[AuthGuard]},
  {path:'usuario-form', component: UsuarioFormComponent, canActivate:[AuthGuard]},
  {path:'usuario-detalle/:id', component: UsuarioDetalleComponent, canActivate:[AuthGuard]},
  {path:'agenda', component: AgendaComponent, canActivate:[AuthGuard]},
  {path:'private', component: PrivateComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
