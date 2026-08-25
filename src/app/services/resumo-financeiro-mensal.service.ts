import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExtratoItem } from '../models/extratoItem.model';

@Injectable({
	providedIn: 'root'
})
export class ResumoFinanceiroMensalService {
	private atualizarOpcoesDespesas = new BehaviorSubject<boolean>(false);
	private dadosExportacaoPdf = new BehaviorSubject<ExtratoItem[]>([]);

	setAtualizarOpcoesDespesas(atualizar: boolean) {
		this.atualizarOpcoesDespesas.next(atualizar);
	}

	getAtualizarOpcoesDespesas() {
		return this.atualizarOpcoesDespesas.asObservable();
	}

	setDadosExportacaoPdf(dados: ExtratoItem[]) {
		this.dadosExportacaoPdf.next(dados);
	}

	getDadosExportacaoPdf() {
		return this.dadosExportacaoPdf.asObservable();
	}
}
