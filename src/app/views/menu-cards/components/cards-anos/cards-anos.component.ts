import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Router } from "@angular/router";
import { GastosService } from '../../../../services/gastos.service';
import { Ano } from '../../../../models/ano.model';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { MenuCardsComponent } from '../../menu-cards.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { SnackbarService } from '../../../../services/snackbar.service';
import { CalendarioService } from '../../../../services/calendario.service';


@Component({
  selector: 'app-cards-anos',
  imports: [MenuCardsComponent, MenuComponent, NgTemplateOutlet, LoadingComponent, NgIf],
  templateUrl: './cards-anos.component.html',
  styleUrl: './cards-anos.component.scss'
})

export class CardsAnosComponent implements OnInit {
  private router = inject(Router);
  private calendarioService = inject(CalendarioService);
  private snackbar = inject(SnackbarService);

  anos = toSignal(this.calendarioService.getAnos(), { initialValue: [] });
  loading = computed(() => this.anos().length === 0);

  ngOnInit(): void {
    if (!this.loading())
      return this.snackbar.error('erro ao carregar dados');
  }

  aoClicarNoCardAnoDeveIrParaMeses(ano: Ano) {
    this.router.navigate([`/${ano.id}/card-meses`]);
  }
}
