import { Routes } from '@angular/router';
import { DetalhesComponent } from './views/detalhes/detalhes.component';
import { LoginComponent } from './views/auth/components/login/login.component';
import { HomeComponent } from './views/dashboard/dashboard.component';
import { CardsAnosComponent } from './views/menu-cards/components/cards-anos/cards-anos.component';
import { CardsMesesComponent } from './views/menu-cards/components/cards-meses/cards-meses.component';
import { AuthComponent } from './views/auth/auth.component';
import { RegistroComponent } from './views/auth/components/registro/registro.component';
import { EsqueciSenhaComponent } from './views/auth/components/esqueci-senha/esqueci-senha.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth', component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'esqueci-senha', component: EsqueciSenhaComponent }
    ]
  },
  {
    path: ':ano/card-meses', canActivate: [authGuard], component: CardsMesesComponent
  },
  {
    path: 'card-anos', canActivate: [authGuard], component: CardsAnosComponent
  },
  {
    path: ':ano/:mes/detalhes', canActivate: [authGuard], component: DetalhesComponent
  },
  {
    path: ':ano/:mes/:id', canActivate: [authGuard], component: DetalhesComponent
  },

  {
    path: 'home', canActivate: [authGuard], component: HomeComponent
  },

  {
    path: '**', redirectTo: '/auth/login'
  }
];
