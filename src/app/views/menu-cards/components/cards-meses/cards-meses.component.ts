import { GastosService } from '../../../../services/gastos.service';
import { CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Mes } from '../../../../models/mes.model';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin, map, switchMap } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { MenuCardsComponent } from '../../menu-cards.component';

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
export class CardsMesesComponent implements OnInit {
  paramsRoute: any;

  constructor(
    private gastosService: GastosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.paramsRoute = this.activatedRoute.snapshot.params;
    console.log(this.paramsRoute);

  }

  meses: Mes[] = [];
  dadosCard: any[] = [];
  cards: any[] = [];
  loading = false;

  ngOnInit() {
    this.carregarDados();
  }


  carregarDados() {
    this.loading = true;
    forkJoin([
      this.gastosService.getGastos(this.paramsRoute.ano),
      this.gastosService.getMeses()
    ]).pipe(finalize(() => (this.loading = false))).subscribe(([despesas, meses]) => {

        console.log('Despesas:', despesas);
        console.log('Meses:', meses);

        this.meses = meses;

        this.dadosCard = meses.map(m => {
          return {
            ...m,
            despesas: despesas.filter((d: any) => d.mes === m.id)
          }
        })

        console.log(this.dadosCard);

    });
  }


  aoClicarNoCardMesDeveIrParaDetalhes(card: any) {
    if (card.despesas.length === 0){
      this.router.navigate([`${this.paramsRoute.ano}/${card.id}/detalhes`])
      return;
    }

    const id = card.despesas[0].id

    this.router.navigate([`${this.paramsRoute.ano}/${card.id}/${id}`])
  }

  deveVoltarParaMenuAnos() {
    this.router.navigate(['/card-anos'])
  }

}