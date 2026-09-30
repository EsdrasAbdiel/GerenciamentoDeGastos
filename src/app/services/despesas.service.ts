import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExtratoItem } from '../models/extratoItem.model';
import { StatusImportacaoExtrato } from '../enums/status-importacao-extrato.enum';
import { RetornoBase } from '../models';

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

	postImportacaoExtrato(params: PostImportacaoExtrato): Observable<RetornoBase> {
		return this.http.post<RetornoBase>(`${environment.BASE_URL.importacaoExtrato}`, params);
	}

	getImportacaoExtratoPeloId(tenantId: string): Observable<ImportacaoExtrato[]> {
		return this.http.get<ImportacaoExtrato[]>(`${environment.BASE_URL.importacaoExtrato}${tenantId}`);
	}
}
