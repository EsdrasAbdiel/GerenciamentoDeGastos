import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Registro } from '../models/registro.model';

@Injectable({
	providedIn: 'root'
})
export class RegistroService {
	private informacoesCadastroUsuario = new BehaviorSubject<Registro | null>(null);

	setInformacoesCadastroUsuario(informacoes: Registro) {
		this.informacoesCadastroUsuario.next(informacoes);
	}

	getInformacoesCadastroUsuario() {
		return this.informacoesCadastroUsuario.asObservable();
	}
}
