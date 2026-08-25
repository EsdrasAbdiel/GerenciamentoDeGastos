import { Ano } from './../models/ano.model';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mes } from '../models/mes.model';
import { ResumoFinanceiroMensal } from '../models/resumo-financeiro-mensal.model';
import { RetornoApi, RetornoBase } from '../models/retorno-api.model';
import { DespesaItem } from '../models/despesaItem.model';
import { EntradaItem } from '../models/entradaItem.model';

export interface ResumoFinanceiroMensalRequest {
  id?: string;
  valorDespesaTotal: number;
  valorEntradaTotal: number;
  dataInclusao: string;
  ano: number;
  mes: number;
  despesas: DespesaItem[];
  entradas: EntradaItem[];
  usuarioId: string;
}

export interface DespesaRequest {
  descricao: string;
  categoriaId: string;
}

@Injectable({
	providedIn: 'root'
})
export class GastosService {

  private readonly http = inject(HttpClient);

	getGastos(ano: number): Observable<ResumoFinanceiroMensal>{
		return this.http.get<ResumoFinanceiroMensal>(`${environment.BASE_URL.listarGastos}/${ano}`);
	}

	getAnos(): Observable<Ano[]>{
		return this.http.get<Ano[]>(environment.BASE_URL.listarAnos);
	}

	getMeses(ano: number): Observable<Mes[]>{
		return this.http.get<Mes[]>(`${environment.BASE_URL.listarMeses}`, { params: { ano } });
	}

	getDespesaPeloId(id: string): Observable<ResumoFinanceiroMensal>{
		return this.http.get<ResumoFinanceiroMensal>(`${environment.BASE_URL.buscarDespesa}/${id}`);
	}
	putDespesaPeloId(id: string, despesa: ResumoFinanceiroMensalRequest): Observable<RetornoApi<RetornoBase>>{
		return this.http.put<RetornoApi<RetornoBase>>(`${environment.BASE_URL.atualizarDespesa}/${id}`, despesa);
	}

	postCadastroDespesas(params: ResumoFinanceiroMensalRequest): Observable<RetornoBase>{
		return this.http.post<RetornoBase>(environment.BASE_URL.cadastro, params);
	}
}
