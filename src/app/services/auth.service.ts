import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Registro } from '../models/registro.model';
import { inject, Injectable } from '@angular/core';
import { RetornoApi, RetornoBase } from '../models/retorno-api.model';

interface RegistroRequest {
  nome: string;
  email: string;
  dataNascimento: Date;
  senha: number;
  confirmarSenha: number;
}

interface LoginRequest {
  email: string;
  senha: number;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

	public authenticated$ = new BehaviorSubject<boolean | null>(null);


	postRegistrarUsuario(registro: RegistroRequest): Observable<RetornoApi<Registro>> {
		return this.http.post<RetornoApi<Registro>>(`${environment.BASE_URL.registarUsuario}`, registro);
	}

	postUsuario(login: LoginRequest): Observable<RetornoApi<RetornoBase>> {
		return this.http.post<RetornoApi<RetornoBase>>(`${environment.BASE_URL.buscarUsuario}`, login);
	}

	logout() {
		return this.http.post<RetornoApi<RetornoApi<RetornoBase>>>(`${environment.BASE_URL.logout}`, {}).pipe(tap(() => this.authenticated$.next(false)));
	}

	checkAuth(): Observable<boolean> {
		if (this.authenticated$.value !== null) {
			return of(this.authenticated$.value);
		}

		return this.http.get(
			`${environment.BASE_URL.me}`
		).pipe(
			map(() => true),
			tap(() => this.authenticated$.next(true)),
			catchError(() => {
				this.authenticated$.next(false);
				return of(false);
			})
		);
	}

	isAuthenticated(): boolean | null {
		return this.authenticated$.value;
	}

	buscarUsuarioId(): string {
		const usuarioId = localStorage.getItem('usuario_id');

		if (!usuarioId) {
			this.authenticated$.next(false);
			return 'null';
		}

		return usuarioId;
	}
}
