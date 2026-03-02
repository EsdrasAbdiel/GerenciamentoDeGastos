import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { Registro } from '../models/registro.model';
import { Injectable } from '@angular/core';
import { RetornoApi } from '../models/retorno-api.model';

type RegistroRequest = {
  nome: string;
  email: string;
  dataNascimento: Date;
  senha: number;
  confirmarSenha: number;
}

type LoginRequest = {
  email: string;
  senha: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private authenticated$ = new BehaviorSubject<boolean | null>(null);


  postRegistrarUsuario(registro: RegistroRequest): Observable<RetornoApi<Registro>> {
    return this.http.post<RetornoApi<Registro>>(`${environment.BASE_URL.registarUsuario}`, registro)
  }

  postUsuario(login: LoginRequest): Observable<Boolean> {
    return this.http.post<RetornoApi<any>>(`${environment.BASE_URL.buscarUsuario}`, login).pipe(
      tap(() => {
        this.authenticated$.next(true);
      }),
      map(() => true),
      catchError(() => {
        this.authenticated$.next(false);
        return of(false)
      })
    );
  }

  logout() {
    return this.http.post<RetornoApi<any>>(`${environment.BASE_URL.logout}`, {}).pipe(tap(() => this.authenticated$.next(false)))
  }

  checkAuth(): Observable<Boolean> {
    if (this.authenticated$.value !== null) {
      return of(this.authenticated$.value)
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
    )
  }

  isAuthenticated(): boolean | null {
    return this.authenticated$.value;
  }
}
