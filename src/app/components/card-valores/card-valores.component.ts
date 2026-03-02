import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-valores',
  standalone: true,
  imports: [CurrencyPipe, NgClass, NgStyle],
  templateUrl: './card-valores.component.html',
  styleUrl: './card-valores.component.scss'
})
export class CardValoresComponent {
  @Input() valorDespesaTotal!: number;
  @Input() valorEntradaTotal!: number;
  valorSaldoTotal!: number;

  deveRetornarCorValorTotal(valorEntrada: number, valorDespesa: number): string {
    const valor = this.deveSubtrairValores(valorEntrada, valorDespesa)

    if (valor === 0) return 'gray'

    return valor > 0 ? '#5fbf62' : '#C62828'
  }

  deveSubtrairValores(valorEntrada: number, valorDespesa: number) {
    return this.valorSaldoTotal = valorEntrada - valorDespesa
  }
}
