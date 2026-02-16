import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-senha',
  imports: [MatCardModule],
  templateUrl: './esqueci-senha.component.html',
  styleUrl: './esqueci-senha.component.scss'
})
export class EsqueciSenhaComponent {
  private router = inject(Router);

  deveRedirecionarParaTelaLogin() {
    this.router.navigate(['/auth/login']);
  }

}
