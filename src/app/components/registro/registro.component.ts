import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-registro',
  imports: [MatCardModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  private router = inject(Router)

  deveMudarCardParaRegistroOuLogin() {
    this.router.navigate(['/auth/login'])
  }
}
