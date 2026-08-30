import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../components/input/input.component';
import { PasswordInputComponent } from '../../../../components/password-input/password-input.component';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
	selector: 'app-esqueci-senha',
	imports: [MatCardModule, PasswordInputComponent, InputComponent, ButtonComponent],
	templateUrl: './esqueci-senha.component.html',
	styleUrl: './esqueci-senha.component.scss'
})
export class EsqueciSenhaComponent {
	private router = inject(Router);

	deveRedirecionarParaTelaLogin() {
		this.router.navigate(['/auth/login']);
	}

}
