import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { GridEditarExcluirColunas } from '../../components/grid-editar-excluir/grid-editar-excluir-colunas.model';
import { Grid } from './../../enums/grid.enum';
import { DespesaItem } from '../../models/despesaItem.model';
import { EntradaItem } from '../../models/entradaItem.model';
import { FormatarData } from '../../utils/formatar-data.util';
import { ButtonComponent, CardValoresComponent, GridEditarExcluirComponent, InputComponent, MenuComponent, ModalComponent, SelectModel, StatusCompetencia } from '../../components';
import { DespesasService, GastosService, ResumoFinanceiroMensalService } from '../../services';


export interface Despesa {
  f?: number;
  id?: number;
  descricao: string;
  valor: number;
  pago: boolean
  index?: number
}

export interface Entrada {
  indice?: number;
  id?: number;
  entradaDescricao: string;
  entradaValor: number;
  index?: number
}

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MenuComponent,
    MatCheckboxModule,
    MatTooltipModule,
    CardValoresComponent,
    MatButtonModule,
    GridEditarExcluirComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.scss'
})
export class DetalhesComponent implements OnInit, AfterViewInit {
  @ViewChild('viewValorEntrada', { static: true }) viewValorEntrada!: TemplateRef<unknown>;
  @ViewChild('viewDataPagamento', { static: true }) viewDataPagamento!: TemplateRef<unknown>;
  @ViewChild('viewPago', { static: true }) viewPago!: TemplateRef<unknown>;
  @ViewChild('viewValorDespesa', { static: true }) viewValorDespesa!: TemplateRef<unknown>;
  @ViewChild('viewDescricaoDespesa', { static: true }) viewDescricaoDespesa!: TemplateRef<unknown>;
  @ViewChild('viewDataInclusao', { static: true }) viewDataInclusao!: TemplateRef<unknown>;



  formDespesa!: FormGroup;
  formEntrada!: FormGroup;
  dadosDespesas: DespesaItem[] = [];
  dadosEntradas: EntradaItem[] = [];
  dadosEntradasEdicao: EntradaItem[] = [];
  dadosDespesasEdicao: DespesaItem[] = [];
  valoresSomados = 0;
  valoresEntradasSomados = 0;
  adicionarValorEntrada = false;
  loading = false;
  indiceDespesaEmEdicao = -1;
  indiceEntradaEmEdicao = -1;
  private resumoFinanceiroMensalService = inject(ResumoFinanceiroMensalService);
  private despesasService = inject(DespesasService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  gridEnum!: Grid;
  estadoDaLinha!: number;
  StatusCompetencia = StatusCompetencia;
  statusCompetenciaMes!: number;
  opcoesDespesas: SelectModel[] = [];
  tituloSnackbar = '';
  colunasEntradas: GridEditarExcluirColunas[] = [];
  colunasDespesas: GridEditarExcluirColunas[] = [];

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private gastosService = inject(GastosService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private paramsRoute: Params = this.activatedRoute.snapshot.params;

  ngOnInit(): void {
    this.formDespesa = this.fb.group({
      descricao: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      pago: [false],
      dataInclusao: [null]
    });

    this.formEntrada = this.fb.group({
      entradaDescricao: [null],
      entradaValor: [null],
      dataPagamento: [null]
    });

    this.carregarDespesas();

    this.atualizarDespesasOpcoes();
    if (this.paramsRoute['id']) {
      this.carregarDespesasExistentes();
      this.tituloSnackbar = 'Editar Despesa';
      return;
    }
    this.tituloSnackbar = 'Cadastrar Despesa';
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
        key: 'entradaDescricao',
        type: 'text'
      },
      {
        label: 'Valor entrada',
        key: 'entradaValor',
        template: this.viewValorEntrada,
        type: 'number'
      },
      {
        label: 'Data Pagamento',
        key: 'dataPagamento',
        type: 'date',
        template: this.viewDataPagamento
      }
    ];
  }

  carregaColunasDespesas() {
    this.colunasDespesas = [
      {
        label: 'Descricao despesa',
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
        label: 'Pago',
        key: 'pago',
        type: 'checkbox',
        template: this.viewPago
      },
      {
        label: 'Data inclusão',
        key: 'dataInclusao',
        type: 'date',
        template: this.viewDataInclusao
      }
    ];
  }

  atualizarDespesasOpcoes() {
    this.resumoFinanceiroMensalService.getAtualizarOpcoesDespesas().subscribe(
      retorno => {
        if (retorno)
          this.carregarDespesas();
      }
    );
  }

  verificacaoValorPositivoOuNegativo(valor: number) {
    if (valor > 0) {
      return '#28A745';
    } else if (valor < 0) {
      return '#DC3545';
    } else {
      return '#808080';
    }
  }

  carregarDespesas() {
    this.despesasService.buscarDespesas().subscribe(retorno => {
      this.opcoesDespesas = retorno.map(d => ({
        id: d.id,
        descricao: d.descricao
      }));
    });
  }

  deveCadastrarNovaDespesa() {
    this.dialog.open(ModalComponent, {
      width: '100%',
      maxWidth: '50px'
    });
  }

  carregarDespesasExistentes() {
    this.loading = true;
    this.gastosService.getDespesaPeloId(this.paramsRoute['id']).pipe(finalize(() => (this.loading = false))).subscribe(retorno => {
      this.dadosDespesas = retorno.itensDespesa.map(item => {
        return {
          ...item,
          valor: -Math.abs(item.valor),
          dataInclusao: new Date(item.dataInclusao).toISOString().split('T')[0]
        };
      });

      this.dadosEntradas = retorno.itensEntrada.map(item => {
        return {
          ...item,
          dataPagamento: new Date(item.dataPagamento).toISOString().split('T')[0]
        };
      });

      this.dadosDespesasEdicao = [...this.dadosDespesas];

      this.statusCompetenciaMes = retorno.statusCompetenciaMes;

      this.dadosEntradasEdicao = [...this.dadosEntradas];
      this.somarValores();
      this.somarValoresEntradas();
    });

  }

  somarValores() {
    this.valoresSomados = this.dadosDespesasEdicao.reduce((acc, item) => acc + Number(item.valor), 0);
  }

  somarValoresEntradas() {
    const valorEntrada = this.dadosEntradasEdicao.reduce((acc, item) => acc + Number(item.entradaValor), 0);
    console.log(valorEntrada);

    this.valoresEntradasSomados = valorEntrada;
  }

  atualizarValores() {
    this.somarValores();
    this.somarValoresEntradas();
  }

  salvarNoBackend() {
    if (!this.paramsRoute['id']) {
      const paramsCadastro = {
        despesas: this.dadosDespesasEdicao,
        entradas: this.dadosEntradasEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: FormatarData(new Date()),
        mes: Number(this.paramsRoute['mes']),
        ano: Number(this.paramsRoute['ano']),
        usuarioId: this.authService.buscarUsuarioId()
      };

      this.gastosService.postCadastroDespesas(paramsCadastro).subscribe(retorno => {
        if (retorno.sucesso) {
          alert(retorno.mensagem);
        } else {
          console.error(retorno.erro);
        }
      });
    } else {
      const paramsAlteracao = {
        id: this.paramsRoute['id'],
        despesas: this.dadosDespesasEdicao,
        entradas: this.dadosEntradasEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: FormatarData(new Date()),
        mes: Number(this.paramsRoute['mes']),
        ano: Number(this.paramsRoute['ano']),
        usuarioId: this.authService.buscarUsuarioId()
      };

      this.gastosService.putDespesaPeloId(this.paramsRoute['id'], paramsAlteracao).subscribe(retorno => {
        alert(retorno.sucesso ? retorno.mensagem : retorno.mensagem);
      });
    }
  }

  salvarLinhaEntrada(event: Entrada) {
    if (this.estadoDaLinha === Grid.editar) {
      this.dadosEntradasEdicao.map((linha, index) => {
        if (index === event.index) {
          const {dataPagamento, entradaDescricao, entradaValor} = this.formEntrada.value;
          return {
            dataPagamento,
            entradaDescricao,
            entradaValor: Number(entradaValor)
          };
        }
        return {
          ...linha,
          entradaValor: Number(linha.entradaValor)
        };
      });
    } else if (this.estadoDaLinha === Grid.adicionar) {
      const { entradaDescricao, entradaValor } = this.formEntrada.value;

      const adicionandoLinha = { id: 0, entradaDescricao: entradaDescricao, entradaValor: Number(entradaValor), dataPagamento: FormatarData(new Date), entrada_id: '00000000-0000-0000-0000-000000000000' };

      this.dadosEntradasEdicao.push(adicionandoLinha);
    }

    this.atualizarValores();
  }

  salvarLinhaDespesa(event: Despesa) {
    if (this.estadoDaLinha === Grid.editar) {

      this.dadosDespesasEdicao.map((linha, index) => {
        if (index === event.index) {
          return this.formDespesa.value;
        }
        return {
          ...linha,
          valor: Number(linha.valor)
        };
      });
    } else if (this.estadoDaLinha === Grid.adicionar) {
      const { descricao, valor, pago } = this.formDespesa.value;
      const adicionandoLinha = { descricao: descricao, valor: Number(valor), pago: Boolean(pago), despesaId: '00000000-0000-0000-0000-000000000000', id: 0, dataInclusao: FormatarData(new Date) };
      this.dadosDespesasEdicao.push(adicionandoLinha);
    }

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

  excluirLinhaEntrada(event: Entrada) {
    this.dadosEntradasEdicao = this.dadosEntradasEdicao.filter(linha => linha !== event);

    this.dadosEntradas = [...this.dadosEntradasEdicao];

    this.atualizarValores();
  }

  excluirLinhaDespesa(event: Despesa) {
    this.dadosDespesasEdicao = this.dadosDespesasEdicao.filter(linha => linha !== event);

    this.dadosDespesas = [...this.dadosDespesasEdicao];

    this.atualizarValores();
  }

  adicionarLinhaDespesa() {
    this.estadoDaLinha = Grid.adicionar;

    this.atualizarValores();
  }

  criarNovaLinha(): EntradaItem {
  return {
    dataPagamento: '',
    entradaDescricao: '',
    entradaValor: 0,
    tipo: '',
    entrada_id: '00000000-0000-0000-0000-000000000000',
    id: 0
  };
}

criarNovaLinhaDespesa(): DespesaItem {
  return {
    dataInclusao: '',
    descricao: '',
    despesaId: '00000000-0000-0000-0000-000000000000',
    id: 0,
    pago: false,
    valor: 0,
  }
}

  adicionarLinhaEntrada() {
    this.estadoDaLinha = Grid.adicionar;

    this.atualizarValores();
  }

  voltar() {
    this.router.navigate(['/card-anos']);
  }

  get formularioDespesa() {
    return this.formDespesa.controls;
  }
}
