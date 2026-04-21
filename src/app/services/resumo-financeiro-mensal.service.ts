import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumoFinanceiroMensalService {
  private atualizarOpcoesDespesas = new BehaviorSubject<boolean>(false);

  setAtualizarOpcoesDespesas(atualizar: boolean) {
    this.atualizarOpcoesDespesas.next(atualizar);
  }

  getAtualizarOpcoesDespesas() {
    return this.atualizarOpcoesDespesas.asObservable();
  }
}
