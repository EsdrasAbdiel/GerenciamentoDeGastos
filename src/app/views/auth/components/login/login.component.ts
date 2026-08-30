
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { RegistroService } from '../../../../services/registro.service';
import { AuthService } from '../../../../services/auth.service';
import { PasswordInputComponent } from '../../../../components/password-input/password-input.component';
import { InputComponent } from '../../../../components/input/input.component';
import { emailValidator } from '../../../../utils/email-validator.util';
import { SnackbarService } from '../../../../services/snackbar.service';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, ReactiveFormsModule, FormsModule, MatIconModule, MatCardModule, PasswordInputComponent, InputComponent, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  registrarUsuario = false;
  loading!: boolean;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private registroService = inject(RegistroService);
  private snackbarService = inject(SnackbarService);

  constructor(

  ) {
    this.inicializarFormGroup();
  }

  ngOnInit(): void {
    this.carregarInformacoesDaTelaDeRegistro();
  }

  private inicializarFormGroup() {
    this.form = this.fb.group({
      email: [null, [Validators.required, emailValidator()]],
      senha: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  carregarInformacoesDaTelaDeRegistro() {
    this.registroService.getInformacoesCadastroUsuario().subscribe(
      (informacoesRegistro) => {
        if (informacoesRegistro) {
          this.form.patchValue({
            email: informacoesRegistro.email
          });
        }
      }
    );
  }

  deveBuscarUsuario() {
    this.loading = true;
    const { email, senha } = this.form.value;

    const params = {
      email: String(email),
      senha: Number(senha)
    };

    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.authService.postUsuario(params).pipe((finalize(() => this.loading = false))).subscribe(
        retorno => {
          if (retorno.sucesso)
            this.authService.authenticated$.next(retorno.sucesso);
          localStorage.setItem('usuario_id', String(retorno.resultado));
          this.router.navigate(['/dashboard']);
        },
        error => {
          const mensagem = error.error?.mensagem ?? 'Erro ao efetuar login';

          this.snackbarService.error(mensagem);
        }
      );
    }
  }

  deveFazerRegistro() {
    this.router.navigate(['/auth/registro']);
  }

  deveRedefinirSenha() {
    this.router.navigate(['/auth/esqueci-senha']);
  }

  get formulario() {
    return this.form.controls;
  }
}
