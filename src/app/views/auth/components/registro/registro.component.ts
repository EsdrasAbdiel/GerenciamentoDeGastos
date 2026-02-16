import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';
import { RegistroService } from '../../../../services/registro.service';
import { InputComponent } from '../../../../components/input/input.component';
import { PasswordInputComponent } from '../../../../components/password-input/password-input.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule, NgIf, ReactiveFormsModule, MatIconModule, InputComponent, PasswordInputComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  form!: FormGroup
  password = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private registroService: RegistroService
  ) {

    this.form = this.fb.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      dataNascimento: [null, [Validators.required]],
      senha: [null, [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      confirmarSenha: [null, [Validators.required, Validators.maxLength(6)]],
      teste1: ['']
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  deveFazerLogin() {
    this.router.navigate(['/auth/login'])
  }

  deveCadastrarUsuario() {
    const { nome, email, dataNascimento, senha, confirmarSenha } = this.form.value

    const params = {
      nome,
      email,
      dataNascimento: new Date(dataNascimento),
      senha: Number(senha),
      confirmarSenha: Number(confirmarSenha),
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched()
    } else {
      this.authService.postRegistrarUsuario(params).pipe().subscribe(
        retorno => {
          if (retorno.sucesso) {
            alert(retorno.mensagem)
            this.registroService.setInformacoesCadastroUsuario(retorno.resultado)
            this.router.navigate(['/auth/login'])
          } else {
            alert(retorno.mensagem)
          }
        }
      )
    }
  }

  get formulario() {
    return this.form.controls;
  }

  deveVerificarCampoSemValorETocado(formControlName: string) {
    return !this.formulario[`${formControlName}`]?.value && this.formulario[`${formControlName}`]?.touched
  }
}
