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
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      login: [null],
      senha: [null]
    })
  }

  login = 'admin';
  senha = 123;

  conferirLogin() {
    console.log(this.form.value);

    const { login, senha } = this.form.value;

    if (login === this.login && senha === this.senha) {
      this.router.navigate(['home'])
    } else {
      alert('Erro ao fazer login')
    }
  }
}
