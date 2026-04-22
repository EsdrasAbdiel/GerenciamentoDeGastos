import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-valores',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './card-valores.component.html',
  styleUrl: './card-valores.component.scss'
})
export class CardValoresComponent {
  @Input() valorDespesaTotal!: number;
  @Input() valorEntradaTotal!: number;
  valorSaldoTotal: number = 0;

  deveSubtrairValores(valorEntrada: number, valorDespesa: number): number {
    return this.valorSaldoTotal = valorEntrada - valorDespesa
  }
}
