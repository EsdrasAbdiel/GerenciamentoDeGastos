import { Routes } from '@angular/router';
import { ConsultaComponent } from './views/consulta/consulta.component';
import { DetalhesComponent } from './views/detalhes/detalhes.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { CardsAnosComponent } from './components/cards-anos/cards-anos.component';
import { CardsMesesComponent } from './components/cards-meses/cards-meses.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: ':ano/card-meses', component: CardsMesesComponent
  },
  {
    path: 'consulta', component: ConsultaComponent
  },
  {
    path: 'card-anos', component: CardsAnosComponent
  },
  {
    path: ':ano/:mes/detalhes', component: DetalhesComponent
  },
  {
    path: ':ano/:mes/:id', component: DetalhesComponent
  },

  {
    path: 'home', component: HomeComponent
  },

  {
    path: '**', redirectTo: 'login'
  }
];
