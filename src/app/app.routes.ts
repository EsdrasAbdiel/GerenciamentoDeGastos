import { Routes } from '@angular/router';
import { ConsultaComponent } from './views/consulta/consulta.component';
import { DetalhesComponent } from './views/detalhes/detalhes.component';
import { LoginComponent } from './views/auth/components/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthComponent } from './views/auth/auth.component';
import { RegistroComponent } from './views/auth/components/registro/registro.component';
import { EsqueciSenhaComponent } from './views/auth/components/esqueci-senha/esqueci-senha.component';
// import { authGuard } from './guards/auth.guard';
import { ExportacaoPdfComponent } from './views/exportacao-pdf/exportacao-pdf.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { MenuCardsComponent } from './views/menu-cards/menu-cards.component';
import { DetalhesExportacaoPdfComponent } from './views/detalhes-exportacao-pdf/detalhes-exportacao-pdf.component';

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
		path: 'consulta', component: ConsultaComponent
	},
	{
		path: 'card-anos', component: MenuCardsComponent
	},
	{
		path: ':ano/:mes/detalhes', component: DetalhesComponent
	},
	{
		path: ':ano/:mes/:id', component: DetalhesComponent
	},
	{
		path: 'exportacao-pdf', component: ExportacaoPdfComponent
	},
	{
		path: 'detalhes-exportacao-pdf', component: DetalhesExportacaoPdfComponent
	},
	{
		path: 'dashboard', component: DashboardComponent
	},

	{
		path: 'calendario', component: CalendarioComponent
	},

	{
		path: '**', redirectTo: '/auth/login'
	}
];
