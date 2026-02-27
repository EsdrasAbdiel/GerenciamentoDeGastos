import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  postRegistrarUsuario(registro: RegistroRequest): Observable<RetornoApi<Registro>> {
    return this.http.post<RetornoApi<Registro>>(`${environment.BASE_URL.registarUsuario}`, registro)
  }

  postUsuario(login: LoginRequest): Observable<RetornoApi<any>> {
    return this.http.post<RetornoApi<any>>(`${environment.BASE_URL.buscarUsuario}`, login)
  }
}
