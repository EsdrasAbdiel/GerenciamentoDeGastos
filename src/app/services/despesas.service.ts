import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Despesa } from '../models/despesa.model';
import { ExtratoItem } from '../models/extratoItem.model';
import { StatusImportacaoExtrato } from '../enums/status-importacao-extrato.enum';
import { RetornoBase } from '../models';

interface PostDespesa {
  descricao: string;
  categoriaId: number;
}

export interface PostImportacaoExtrato {
  usuarioId: string;
  extrato: ExtratoItem[]
}

export interface ImportacaoExtrato {
  id: number;
  idResumoFinanceiro: string;
  usuarioId: string;
  dataImportacao: string;
  status: StatusImportacaoExtrato;
  quantidadeLancamentos: number;
  referenciaMes: number;
}

@Injectable({
	providedIn: 'root'
})
export class DespesasService {

	private http = inject(HttpClient);

	buscarDespesas(): Observable<Despesa[]> {
		return this.http.get<Despesa[]>(`${environment.BASE_URL.despesas}`);
	}

	cadastrarDespesa(params: PostDespesa): Observable<RetornoBase> {
		return this.http.post<RetornoBase>(`${environment.BASE_URL.despesas}`, params);
	}

	cadastrarResumoFinanceiroImportacaoExtrato(params: PostImportacaoExtrato): Observable<RetornoBase> {
		return this.http.post<RetornoBase>(`${environment.BASE_URL.cadastrarResumoFinanceiroImportacaoExtrato}`, params);
	}

	buscarExtratoPeloTenantId(tenantId: string): Observable<ImportacaoExtrato[]> {
		return this.http.get<ImportacaoExtrato[]>(`${environment.BASE_URL.buscarExtratoPeloTenantId}/${tenantId}`);
	}
}
