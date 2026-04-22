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
import { SnackbarService } from '../../../../services/snackbar.service';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule, NgIf, ReactiveFormsModule, MatIconModule, InputComponent, PasswordInputComponent, ButtonComponent],
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
    private registroService: RegistroService,
    private snackbarService: SnackbarService
  ) {

    this.form = this.fb.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      dataNascimento: [null, [Validators.required]],
      senha: [null, [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      confirmarSenha: [null, [Validators.required, Validators.maxLength(6)]],
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  deveFazerLogin() {
    this.router.navigate(['/auth/login'])
  }

  converterData(data: string): Date {
  const [dia, mes, ano] = data.split('/');
  return new Date(`${ano}-${mes}-${dia}`);
}

  deveCadastrarUsuario() {
    const { nome, email, dataNascimento, senha, confirmarSenha } = this.form.value

    const params = {
      nome,
      email,
      dataNascimento: this.converterData(dataNascimento),
      senha: Number(senha),
      confirmarSenha: Number(confirmarSenha),
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.authService.postRegistrarUsuario(params).pipe().subscribe(
        retorno => {
          if (retorno.sucesso) {
            this.snackbarService.success(retorno.mensagem);
            this.registroService.setInformacoesCadastroUsuario(retorno.resultado);
            this.router.navigate(['/auth/login']);
          }
        },
        error => {
          this.snackbarService.error(error?.error.mensagem ? error?.error.mensagem : 'Erro ao efetuar registro' )
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
