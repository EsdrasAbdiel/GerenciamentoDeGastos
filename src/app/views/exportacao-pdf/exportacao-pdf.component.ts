import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ResumoFinanceiroMensalService } from '../../services/resumo-financeiro-mensal.service';
import { SnackbarService } from '../../services/snackbar.service';
import { DespesasService, ImportacaoExtrato } from '../../services/despesas.service';
import { AuthService } from '../../services/auth.service';
import { GridAcoesComponent } from '../../components/grid-acoes/grid-acoes.component';
import { GridAcoesModel } from '../../components/grid-acoes/grid-acoes.model';
import { Router } from '@angular/router';
import { ExtratoItem } from '../../models/extratoItem.model';

@Component({
  selector: 'app-exportacao-pdf',
  standalone: true,
  imports: [MenuComponent, CommonModule, GridAcoesComponent],
  templateUrl: './exportacao-pdf.component.html',
  styleUrl: './exportacao-pdf.component.scss'
})
export class ExportacaoPdfComponent implements OnInit {
  dados: ImportacaoExtrato[] = [];
  colunas: GridAcoesModel[] = [];
  dadosConsulta: ImportacaoExtrato[] = [];

  private readonly http = inject(HttpClient);
  private readonly resumoService = inject(ResumoFinanceiroMensalService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly despesasService = inject(DespesasService);
  private readonly authservice = inject(AuthService);
  private readonly router = inject(Router);


  ngOnInit(): void {
    this.carregarColunas();
    this.buscarExtratos();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.type != 'application/pdf') {
      alert('não é pdf');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<ExtratoItem[]>('http://localhost:8080/api/importacaoExtrato/importar', formData)
      .subscribe({
        next: res => {
          if (res) {
            this.resumoService.setDadosExportacaoPdf(res);
            this.router.navigate(['/detalhes-exportacao-pdf']);
          }
          input.value = '';
        },
        error: erro => {
          console.error(erro.error.erro);
          this.snackbarService.error(erro.error.mensagem);
          input.value = '';
        }
      });
  }

  carregarColunas() {
    this.colunas = [
      { label: 'Data Importação', key: 'dataImportacao', type: 'date' },
      { label: 'Status', key: 'status', type: 'number' }
    ]
  }

  confirmar() {
    const resultado = confirm('Deseja importar esse extrato no mês X?');

    if (!resultado)
      return;

    this.http.post('http://localhost:5000/api/salvar-importacao', this.dados)
      .subscribe(() => {
        this.router.navigate(['/exportacao-pdf']);
      });
  }

  buscarExtratos() {
    this.despesasService.buscarExtratoPeloTenantId(this.authservice.buscarUsuarioId()).subscribe(retorno => {
      this.dadosConsulta = retorno;
    });
  }
}
