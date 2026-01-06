import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from '../menu/menu.component';
import { ActivatedRoute, Router } from "@angular/router";
import { GastosService } from '../../services/gastos.service';
import { Ano } from '../../models/ano.model';
import { LoadingComponent } from '../loading/loading.component';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cards-anos',
  imports: [MatCardModule, CommonModule, MenuComponent, LoadingComponent],
  templateUrl: './cards-anos.component.html',
  styleUrl: './cards-anos.component.scss'
})

export class CardsAnosComponent implements OnInit {

  anos: Ano[] = []
  paramsRoute: any;
  loading!: boolean;

  constructor(
    private router: Router,
    private gastosService: GastosService,
  ) {
  }


  ngOnInit(): void {
    this.listarAnos();
  }

  aoClicarNoCardAnoDeveIrParaMeses(ano: Ano) {
    this.router.navigate([`/${ano.id}/card-meses`])
  }

  listarAnos() {
    this.loading = true;
    this.gastosService.getAnos().pipe(finalize(() => (this.loading = false))).subscribe(
      (retorno) => {
        this.anos = retorno;
      },
      (error) => {
        console.error('Erro ao carregar dados.', error.message)
      }
    )
  }
}
