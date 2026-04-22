import { Ano } from './../models/ano.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mes } from '../models/mes.model';
import { ResumoFinanceiroMensal } from '../models/resumo-financeiro-mensal.model';

@Injectable({
  providedIn: 'root'
})
export class GastosService {


  constructor(private http: HttpClient) { }

  getGastos(ano: number): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL.listarGastos}/${ano}`)
  }

  getAnos(): Observable<Ano[]>{
    return this.http.get<Ano[]>(environment.BASE_URL.listarAnos)
  }

  getMeses(ano: number): Observable<Mes[]>{
    return this.http.get<Mes[]>(`${environment.BASE_URL.listarMeses}`, { params: { ano } })
  }

  getDespesaPeloId(id: string): Observable<ResumoFinanceiroMensal>{
    return this.http.get<ResumoFinanceiroMensal>(`${environment.BASE_URL.buscarDespesa}/${id}`)
  }
  putDespesaPeloId(id: string, despesa: any): Observable<any>{
    return this.http.put<any>(`${environment.BASE_URL.atualizarDespesa}/${id}`, despesa)
  }

  postCadastroDespesas(params: any): Observable<any>{
    return this.http.post<any>(environment.BASE_URL.cadastro, params)
  }

  deleteDespesa(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.BASE_URL.deletarDespesa}/${id}`)
  }
}
