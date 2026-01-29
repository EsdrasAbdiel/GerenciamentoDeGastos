import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private Router: Router) {

  }
  email: string = ''
  password: string = ''

  onSubmit() {
    console.log('Login tentado:', this.email, this.password);
    // Aqui vai sua lógica de autenticação (AuthService, etc.)
  }

  redirecionar() {
    this.Router.navigate(['/card-anos'])
  }
}
