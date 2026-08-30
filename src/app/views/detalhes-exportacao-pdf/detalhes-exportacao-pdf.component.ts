import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Grid } from '../../enums/grid.enum';
import { ButtonComponent, CardValoresComponent, GridAcoesComponent, InputComponent, MenuComponent } from '../../components';
import { AuthService, DespesasService, ResumoFinanceiroMensalService, SnackbarService } from '../../services';
import { ExtratoItem } from '../../models';
import { GridAcoesModel } from '../../components/grid-acoes/grid-acoes.model';

@Component({
	selector: 'app-detalhes-exportacao-pdf',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatCheckboxModule,
		MenuComponent,
		GridAcoesComponent,
		CardValoresComponent,
		ButtonComponent,
		InputComponent
	],
	templateUrl: './detalhes-exportacao-pdf.component.html',
	styleUrl: './detalhes-exportacao-pdf.component.scss'
})
export class DetalhesExportacaoPdfComponent implements OnInit, AfterViewInit {
  @ViewChild('viewValorEntrada', { static: true }) viewValorEntrada!: TemplateRef<unknown>;
  @ViewChild('viewDataPagamento', { static: true }) viewDataPagamento!: TemplateRef<unknown>;
  @ViewChild('viewValorDespesa', { static: true }) viewValorDespesa!: TemplateRef<unknown>;
  @ViewChild('viewDescricaoDespesa', { static: true }) viewDescricaoDespesa!: TemplateRef<unknown>;
  @ViewChild('viewDataDespesa', { static: true }) viewDataDespesa!: TemplateRef<unknown>;

  private resumo = inject(ResumoFinanceiroMensalService);
  private despesaService = inject(DespesasService);
  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  dados: ExtratoItem[] = [];
  entrada: ExtratoItem[] = [];
  despesa: ExtratoItem[] = [];
  entradaEdicao: ExtratoItem[] = [];
  despesaEdicao: ExtratoItem[] = [];

  colunasEntradas: GridAcoesModel[] = [];
  colunasDespesas: GridAcoesModel[] = [];
  formEntrada!: FormGroup;
  formDespesa!: FormGroup;

  valoresSomados = 0;
  valoresEntradasSomados = 0;
  estadoDaLinha!: number;

  constructor() {
  	this.formEntrada = this.fb.group({
  		descricao: [null, [Validators.required]],
  		valor: [null, [Validators.required]],
  		data: [null]
  	});

  	this.formDespesa = this.fb.group({
  		descricao: [null, [Validators.required]],
  		valor: [null, [Validators.required]],
  		data: [null]
  	});
  }

  ngOnInit(): void {
  	this.resumo.getDadosExportacaoPdf().subscribe(retorno => {
  		const dados = retorno ?? [];

  		this.dados = dados;
  		this.entrada = dados.filter((i: ExtratoItem) => i.tipo === 'Entrada');
  		this.despesa = dados.filter((i: ExtratoItem) => i.tipo === 'Saida');
  		this.entradaEdicao = [...this.entrada];
  		this.despesaEdicao = [...this.despesa];
  		this.atualizarValores();
  	});
  }

  ngAfterViewInit(): void {
  	this.carregaColunasEntradas();
  	this.carregaColunasDespesas();
  	this.cdr.detectChanges();
  }

  carregaColunasEntradas() {
  	this.colunasEntradas = [
  		{
  			label: 'Descricao entrada',
  			key: 'descricao',
  			type: 'text'
  		},
  		{
  			label: 'Valor entrada',
  			key: 'valor',
  			template: this.viewValorEntrada,
  			type: 'number'
  		},
  		{
  			label: 'Data Pagamento',
  			key: 'data',
  			type: 'date',
  			template: this.viewDataPagamento
  		}
  	];
  }

  carregaColunasDespesas() {
  	this.colunasDespesas = [
  		{
  			label: 'Descricao Despesa',
  			key: 'descricao',
  			type: 'text',
  			template: this.viewDescricaoDespesa
  		},
  		{
  			label: 'Valor Despesa',
  			key: 'valor',
  			template: this.viewValorDespesa,
  			type: 'number'
  		},
  		{
  			label: 'Data Pagamento',
  			key: 'data',
  			type: 'date',
  			template: this.viewDataDespesa
  		}
  	];
  }

  somarValores() {
  	this.valoresSomados = this.despesaEdicao.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }

  somarValoresEntradas() {
  	this.valoresEntradasSomados = this.entradaEdicao.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }

  atualizarValores() {
  	this.somarValores();
  	this.somarValoresEntradas();
  }

  salvarLinhaEntrada(event: ExtratoItem) {
  	if (this.estadoDaLinha === Grid.editar) {
  		this.entradaEdicao = this.entradaEdicao.map((linha, index) => {
  			if (index === event.index) {
  				return { ...this.formEntrada.value, tipo: 'Entrada' };
  			}
  			return linha;
  		});
  	} else if (this.estadoDaLinha === Grid.adicionar) {
  		const { descricao, valor, data } = this.formEntrada.value;
  		this.entradaEdicao.push({
  			descricao,
  			valor: Number(valor),
  			data: data,
  			tipo: 'Entrada',
  		});
  	}

  	this.entrada = [...this.entradaEdicao];
  	this.sincronizarDados();
  	this.atualizarValores();
  }

  salvarLinhaDespesa(event: ExtratoItem) {
  	if (this.estadoDaLinha === Grid.editar) {
  		this.despesaEdicao = this.despesaEdicao.map((linha, index) => {
  			if (index === event.index) {
  				return { ...this.formDespesa.value, tipo: 'Saida' };
  			}
  			return linha;
  		});
  	} else if (this.estadoDaLinha === Grid.adicionar) {
  		const { descricao, valor, data } = this.formDespesa.value;
  		this.despesaEdicao.push({
  			descricao,
  			valor: Number(valor),
  			data: data,
  			tipo: 'Saida'
  		});
  	}

  	this.despesa = [...this.despesaEdicao];
  	this.sincronizarDados();
  	this.atualizarValores();
  }

  editarLinhaEntrada() {
  	this.estadoDaLinha = Grid.editar;
  	this.atualizarValores();
  }

  editarLinhaDespesa() {
  	this.estadoDaLinha = Grid.editar;
  	this.atualizarValores();
  }

  excluirLinhaEntrada(event: ExtratoItem) {
  	this.entradaEdicao = this.entradaEdicao.filter(linha => linha !== event);
  	this.entrada = [...this.entradaEdicao];
  	this.sincronizarDados();
  	this.atualizarValores();
  }

  excluirLinhaDespesa(event: ExtratoItem) {
  	this.despesaEdicao = this.despesaEdicao.filter(linha => linha !== event);
  	this.despesa = [...this.despesaEdicao];
  	this.sincronizarDados();
  	this.atualizarValores();
  }

  adicionarLinhaDespesa() {
  	this.estadoDaLinha = Grid.adicionar;
  	this.atualizarValores();
  }

  adicionarLinhaEntrada() {
  	this.estadoDaLinha = Grid.adicionar;
  	this.atualizarValores();
  }

  sincronizarDados() {
  	this.dados = [...this.entradaEdicao, ...this.despesaEdicao];
  }

  cadastrarExtratoAutomaticamente() {
  	const usuarioId = this.authService.buscarUsuarioId();

  	if (!usuarioId || usuarioId === 'null') {
  		this.snackbar.error('Usuário não autenticado.');
  		return;
  	}

  	if (!this.dados.length) {
  		this.snackbar.error('Nenhum lançamento para importar.');
  		return;
  	}

  	const params = {
  		usuarioId,
  		extrato: this.dados.map(item => ({
  			descricao: item.descricao,
  			valor: Number(item.valor),
  			tipo: item.tipo,
  			data: item.data
  		}))
  	};

  	this.despesaService.cadastrarResumoFinanceiroImportacaoExtrato(params).subscribe({
  		next: retorno => {
  			if (retorno.sucesso) {
  				this.snackbar.success(retorno.mensagem);
  				this.router.navigate(['/exportacao-pdf']);
  				return;
  			}

  			this.snackbar.error(retorno.mensagem ?? 'Erro ao confirmar importação.');
  		},
  		error: erro => {
  			const mensagem =
          erro?.error?.mensagem ??
          erro?.error?.errors?.request?.[0] ??
          erro?.error?.title ??
          'Erro ao confirmar importação.';

  			this.snackbar.error(mensagem);
  		}
  	});
  }

  voltar() {
  	this.router.navigate(['/exportacao-pdf']);
  }
}
