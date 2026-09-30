import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

	getResumoFinanceiroMensal(ano: number): Observable<ResumoFinanceiroMensal>{
		return this.http.get<ResumoFinanceiroMensal>(`${environment.BASE_URL.resumoFinanceiroMensal}${ano}`);
	}

	getResumoFinanceiroMensalPeloId(id: string): Observable<ResumoFinanceiroMensal>{
		return this.http.get<ResumoFinanceiroMensal>(`${environment.BASE_URL.resumoFinanceiroMensal}${id}`);
	}
	putResumoFinanceiroMensalPeloId(id: string, despesa: ResumoFinanceiroMensalRequest): Observable<RetornoApi<RetornoBase>>{
		return this.http.put<RetornoApi<RetornoBase>>(`${environment.BASE_URL.resumoFinanceiroMensal}`, despesa);
	}

	postResumoFinanceiroMensal(params: ResumoFinanceiroMensalRequest): Observable<RetornoBase>{
		return this.http.post<RetornoBase>(environment.BASE_URL.resumoFinanceiroMensal, params);
	}

  deleteResumoFinanceiroMensal(id: string): Observable<RetornoBase> {
    return this.http.delete<RetornoBase>(`${environment.BASE_URL.resumoFinanceiroMensal}${id}`, )
  }
}
