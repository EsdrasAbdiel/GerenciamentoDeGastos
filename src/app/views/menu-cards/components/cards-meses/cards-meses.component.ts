import { GastosService } from '../../../../services/gastos.service';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Mes } from '../../../../models/mes.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { MenuCardsComponent } from '../../menu-cards.component';
import { toSignal } from '@angular/core/rxjs-interop';

export interface CardsMeses {
  mes: number;
  descricao: string;
}

@Component({
  selector: 'app-cards-meses',
  standalone: true,
  imports: [MenuCardsComponent, MenuComponent, NgTemplateOutlet, LoadingComponent, NgIf],
  templateUrl: './cards-meses.component.html',
  styleUrl: './cards-meses.component.scss'
})
export class CardsMesesComponent {
  private gastosService = inject(GastosService)
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  paramsRoute = this.activatedRoute.snapshot.params;

  meses = toSignal(this.gastosService.getMeses(this.paramsRoute['ano']), { initialValue: [] })
  loading = computed(() => this.meses().length === 0);

  aoClicarNoCardMesDeveIrParaDetalhes(card: Mes) {
    console.log(card)
    if (!card.despesaId) {
      this.router.navigate([`${this.paramsRoute['ano']}/${card.id}/detalhes`])
      return;
    }

    this.router.navigate([`${this.paramsRoute['ano']}/${card.id}/${card.despesaId}`])
  }

  deveVoltarParaMenuAnos() {
    this.router.navigate(['/card-anos'])
  }
}