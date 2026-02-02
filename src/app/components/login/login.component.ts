import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MoneyBackgroundComponent } from '../../../assets/money-background/money-background.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatIconModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  form!: FormGroup
  registrarUsuario: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.inicializarFormGroup();
  }

  private inicializarFormGroup() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]]
    })
  }

  redirecionar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('erro ao tentar efetuar o login.')
    } else {
      this.router.navigate(['/card-anos'])
    }
  }

  deveMudarCardParaRegistroOuLogin() {
    this.router.navigate(['/auth/registro'])
  }

  deveRedefinirSenha() {
    this.router.navigate(['/auth/esqueci-senha'])
  }

  get formulario() {
    return this.form.controls;
  }
}
