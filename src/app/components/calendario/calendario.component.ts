import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, computed, inject, Input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterLinkActive } from '@angular/router';
import { Ano } from '../../models/ano.model';
import { CalendarioService } from '../../services/calendario.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { Mes } from '../../models/mes.model';

export enum StatusCompetencia {
  fechado = 2,
  aberto = 1
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [MatCardModule, NgFor, NgStyle, MatIconModule, MatTooltipModule, LoadingComponent, NgIf, RouterLinkActive, CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  loading: boolean = false;
  meses: Mes[] = []
  mesAtual: number = new Date().getMonth() + 1;
  anoAtual: number = new Date().getFullYear();
  StatusCompetencia = StatusCompetencia;
  anoSelecionado!: number;

  private router = inject(Router);
  private calendarioService = inject(CalendarioService);
  private snackbar = inject(SnackbarService);
  private authService = inject(AuthService)



  anos = toSignal(this.calendarioService.getAnos(), { initialValue: [] });

  aoClicarNoCardMesDeveIrParaDetalhes(card: Mes) {
    console.log(card)
    if (!card.despesaId) {
      this.router.navigate([`${this.anoAtual}/${card.id}/detalhes`])
      return;
    }

    this.router.navigate([`${this.anoAtual}/${card.id}/${card.despesaId}`])
  }

  aoClicarNoCardAnoDeveBuscarMeses(ano: number) {
    this.loading = true;
        this.anoSelecionado = ano;
          console.log('Selecionado:', this.anoSelecionado);


    this.anoAtual = ano;
    this.calendarioService.getMeses(ano, this.authService.buscarUsuarioId()).pipe((finalize(() => this.loading = false))).subscribe(
      retorno => {

        this.meses = retorno.map((mes: Mes) => {
          return {
            ...mes,
            status: 1
          }
        })

      }
    )
  }



  ngOnInit(): void {
    this.aoClicarNoCardAnoDeveBuscarMeses(this.anoAtual);
  }

  statusCompetencia(status: StatusCompetencia): string {

    if (status === StatusCompetencia.aberto) {

      return 'Aberto';
    }


    if (status === StatusCompetencia.fechado) {

      return 'Fechado';
    }

    return '-'
  }

  verificarAnoAtual(ano: any) {
    const anoAtual = new Date().getFullYear();

    if (ano === anoAtual) {
      return '#3f51b5'
    } else {
      return 'gray'
    }

  }
}
