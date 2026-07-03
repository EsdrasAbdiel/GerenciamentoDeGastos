import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { GastosService } from '../../services/gastos.service';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTooltipModule } from '@angular/material/tooltip'
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SelectComponent, SelectModel } from '../../components/select/select.component';
import { DespesasService } from '../../services/despesas.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { ResumoFinanceiroMensalService } from '../../services/resumo-financeiro-mensal.service';
import { CardValoresComponent } from '../../components/card-valores/card-valores.component';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { GridEditarExcluirComponent } from '../../components/grid-editar-excluir/grid-editar-excluir.component';
import { GridEditarExcluirColunas } from '../../components/grid-editar-excluir/grid-editar-excluir-colunas.model';
import { Grid } from './../../enums/grid.enum';
import { InputComponent } from './../../components/input/input.component'
import { StatusCompetencia } from '../../components/calendario/calendario.component';
import { ButtonComponent } from '../../components/button/button.component';


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
    LoadingComponent,
    SelectComponent,
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
  @ViewChild('viewValorEntrada', { static: true }) viewValorEntrada!: TemplateRef<any>;
  @ViewChild('viewDataPagamento', { static: true }) viewDataPagamento!: TemplateRef<any>;
  @ViewChild('viewPago', { static: true }) viewPago!: TemplateRef<any>;
  @ViewChild('viewValorDespesa', { static: true }) viewValorDespesa!: TemplateRef<any>;
  @ViewChild('viewDescricaoDespesa', { static: true }) viewDescricaoDespesa!: TemplateRef<any>;

  paramsRoute: any;
  formDespesa!: FormGroup;
  formEntrada!: FormGroup
  dadosDespesas: Despesa[] = [];
  dadosEntradas: Entrada[] = [];
  dadosEntradasEdicao: Entrada[] = [];
  dadosDespesasEdicao: Despesa[] = [];
  valoresSomados = 0;
  valoresEntradasSomados = 0;
  adicionarValorEntrada: boolean = false;
  loading = false;
  indiceDespesaEmEdicao: number = -1;
  indiceEntradaEmEdicao: number = -1;
  private resumoFinanceiroMensalService = inject(ResumoFinanceiroMensalService)
  private despesasService = inject(DespesasService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  gridEnum!: Grid
  estadoDaLinha!: number
  StatusCompetencia = StatusCompetencia;
  statusCompetenciaMes!: number;
  opcoesDespesas: SelectModel[] = [];
  tituloSnackbar = '';
  colunasEntradas: GridEditarExcluirColunas[] = []
  colunasDespesas: GridEditarExcluirColunas[] = []

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private gastosService: GastosService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.paramsRoute = this.activatedRoute.snapshot.params;
    this.formDespesa = this.fb.group({
      descricao: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      pago: [false]
    });

    this.formEntrada = this.fb.group({
      entradaDescricao: [null],
      entradaValor: [null],
      dataPagamento: [null]
    })
  }

  ngOnInit(): void {
    this.carregarDespesas();

    this.atualizarDespesasOpcoes();
    if (this.paramsRoute.id) {
      this.carregarDespesasExistentes();
      this.tituloSnackbar = 'Editar Despesa'
      return;
    }
    this.tituloSnackbar = 'Cadastrar Despesa'
  }

  ngAfterViewInit(): void {
    this.carregaColunasEntradas()
    this.carregaColunasDespesas()

    this.cdr.detectChanges()
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
    ]
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
      }
    ]
  }

  atualizarDespesasOpcoes() {
    this.resumoFinanceiroMensalService.getAtualizarOpcoesDespesas().subscribe(
      retorno => {
        if (retorno)
          this.carregarDespesas();
      }
    )
  }

  verificacaoValorPositivoOuNegativo(valor: number) {
    if (valor > 0) {
      return '#28A745';
    } else if (valor < 0) {
      return '#DC3545'
    } else {
      return '#808080'
    }
  }

  carregarDespesas() {
    this.despesasService.buscarDespesas().subscribe(retorno => {
      this.opcoesDespesas = retorno.map(d => ({
        id: d.id,
        nome: d.descricao
      }));
    })
  }

  deveCadastrarNovaDespesa() {
    this.dialog.open(ModalComponent, {
      width: '100%',
      maxWidth: '50px'
    })
  }

  carregarDespesasExistentes() {
    this.loading = true;
    this.gastosService.getDespesaPeloId(this.paramsRoute.id).pipe(finalize(() => (this.loading = false))).subscribe(retorno => {
      this.dadosDespesas = retorno.itensDespesa

      this.dadosEntradas = retorno.itensEntrada.map(item => {
        return {
          ...item,
          dataPagamento: new Date(item.dataPagamento).toISOString().split('T')[0]
        }
      })

      this.dadosDespesasEdicao = [...this.dadosDespesas]

      this.statusCompetenciaMes = retorno.statusCompetenciaMes;

      console.log(this.dadosDespesasEdicao);

      this.dadosEntradasEdicao = [...this.dadosEntradas]
      this.somarValores();
      this.somarValoresEntradas()
    });

  }

  somarValores() {
    this.valoresSomados = this.dadosDespesasEdicao.reduce((acc, item) => acc + item.valor, 0);
  }

  somarValoresEntradas() {
    this.valoresEntradasSomados = this.dadosEntradasEdicao.reduce((acc, item) => acc + item.entradaValor, 0);
  }

  atualizarValores() {
    this.somarValores();
    this.somarValoresEntradas();
  }

  salvarNoBackend() {
    if (!this.paramsRoute.id) {
      const paramsCadastro = {
        despesas: this.dadosDespesasEdicao,
        entradas: this.dadosEntradasEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: new Date(),
        mes: Number(this.paramsRoute.mes),
        ano: Number(this.paramsRoute.ano),
        usuarioId: this.authService.buscarUsuarioId()
      };

      console.log(paramsCadastro);

      this.gastosService.postCadastroDespesas(paramsCadastro).subscribe(retorno => {
        if (retorno.sucesso) {
          alert(retorno.mensagem)
        } else {
          console.error(retorno.erro)
        }
      });
    } else {
      const paramsAlteracao = {
        id: this.paramsRoute.id,
        despesas: this.dadosDespesasEdicao,
        entradas: this.dadosEntradasEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: new Date(),
        mes: Number(this.paramsRoute.mes),
        ano: Number(this.paramsRoute.ano),
        usuarioId: this.authService.buscarUsuarioId()
      };

      console.log(paramsAlteracao);

      this.gastosService.putDespesaPeloId(this.paramsRoute.id, paramsAlteracao).subscribe(retorno => {
        alert(retorno.sucesso ? retorno.mensagem : retorno.mensagem)
      })
    }
  }

  salvarLinhaEntrada(event: Entrada) {
    if (this.estadoDaLinha === Grid.editar) {
      this.dadosEntradasEdicao.map((linha, index) => {
        if (index === event.index) {
          return this.formEntrada.value
        }
        return linha
      });
    } else if (this.estadoDaLinha === Grid.adicionar) {
      const { entradaDescricao, entradaValor } = this.formEntrada.value;

      const adicionandoLinha = { entradaDescricao: entradaDescricao, entradaValor: Number(entradaValor) }

      this.dadosEntradasEdicao.push(adicionandoLinha);
    }

    this.atualizarValores();
  }

  salvarLinhaDespesa(event: any) {
    console.log(event);
    if (this.estadoDaLinha === Grid.editar) {

      this.dadosDespesasEdicao.map((linha, index) => {
        if (index === event.index) {
          return this.formDespesa.value
        }
        return linha;
      });
    } else if (this.estadoDaLinha === Grid.adicionar) {
      const { descricao, valor, pago } = this.formDespesa.value;
      const adicionandoLinha = { descricao: descricao, valor: Number(valor), pago: Boolean(pago) }
      this.dadosDespesasEdicao.push(adicionandoLinha);
    }

    this.atualizarValores();
  }

  editarLinhaEntrada(event: any) {
    this.estadoDaLinha = Grid.editar;

    this.atualizarValores();
  }

  editarLinhaDespesa(event: any) {
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

  adicionarLinhaEntrada() {
    this.estadoDaLinha = Grid.adicionar;

    this.atualizarValores();
  }

  excluir() {
    var confirmar = confirm('Deseja excluir toda a despesa??');

    if (confirmar)
      this.gastosService.deleteDespesa(this.paramsRoute.id).subscribe(retorno => {
        alert(retorno.message);
      })
  }

  voltar() {
    this.router.navigate([`/card-anos`]);
  }

  get formularioDespesa() {
    return this.formDespesa.controls
  }
}
