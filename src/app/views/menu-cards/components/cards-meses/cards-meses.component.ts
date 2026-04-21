import { GastosService } from '../../../../services/gastos.service';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Mes } from '../../../../models/mes.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { MenuCardsComponent } from '../../menu-cards.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalendarioService } from '../../../../services/calendario.service';
import { ButtonComponent } from '../../../../components/button/button.component';

export interface CardsMeses {
  mes: number;
  descricao: string;
}

@Component({
  selector: 'app-cards-meses',
  standalone: true,
  imports: [MenuCardsComponent, MenuComponent, NgTemplateOutlet, LoadingComponent, NgIf, ButtonComponent],
  templateUrl: './cards-meses.component.html',
  styleUrl: './cards-meses.component.scss'
})
export class CardsMesesComponent {
  private calendarioService = inject(CalendarioService)
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  paramsRoute = this.activatedRoute.snapshot.params;

  meses = toSignal(this.calendarioService.getMeses(this.paramsRoute['ano']), { initialValue: [] })
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
