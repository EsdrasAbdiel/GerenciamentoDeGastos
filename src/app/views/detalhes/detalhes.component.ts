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


export interface Despesa {
  f?: number;
  id?: number;
  descricao: string;
  valor: number;
  pago: boolean
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
    GridEditarExcluirComponent
  ],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.scss'
})
export class DetalhesComponent implements OnInit, AfterViewInit {
  @ViewChild('viewValorEntrada', { static: true }) viewValorEntrada!: TemplateRef<any>;

  paramsRoute: any;
  form!: FormGroup;
  formEntrada!: FormGroup
  dadosDespesasEmEdicao: Despesa[] = [];
  dadosEntradas: Entrada[] = [];
  dadosEntradasEdicao: Entrada[] = [];
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

  opcoesDespesas: SelectModel[] = [];
  tituloSnackbar = '';
  colunasEntradas: GridEditarExcluirColunas[] = []

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private gastosService: GastosService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.paramsRoute = this.activatedRoute.snapshot.params;
    this.form = this.fb.group({
      valorSaida: [null],
      entradaValor: [null, Validators.required],
      descricaoEntrada: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      pago: [false]
    });

    this.formEntrada = this.fb.group({
      entradaDescricao: [null],
      entradaValor: [null],
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
      this.dadosDespesasEmEdicao = retorno.itensDespesa

      this.dadosEntradas = retorno.itensEntrada

      this.dadosEntradasEdicao = [...this.dadosEntradas]
      this.somarValores();
      this.somarValoresEntradas()
    });

  }

  // Inicia edição de uma linha existente
  iniciarEdicao(index: number) {
    this.indiceDespesaEmEdicao = index;
    const item = this.dadosDespesasEmEdicao[index];

    this.form.patchValue({
      descricao: { nome: item.descricao, id: 0 },
      valor: item.valor,
      pago: item.pago
    });
  }

  // Inicia adição de nova linha (no final)
  adicionarNovaLinha() {
    this.indiceDespesaEmEdicao = this.dadosDespesasEmEdicao.length; // coloca no final
    this.form.reset();
  }

  gerarIdPorItemDespesa() {
    return this.dadosDespesasEmEdicao.length + 1;
  }

  // Confirma (edição ou adição)
  confirmar() {
    const { descricao, valor, pago } = this.form.value;


    if (this.indiceDespesaEmEdicao === this.dadosDespesasEmEdicao.length) {
      // É uma NOVA linha
      this.dadosDespesasEmEdicao.push({
        //id: this.gerarIdPorItemDespesa(),
        descricao: descricao.nome,
        valor: Number(valor),
        pago: pago ?? false
      });
    } else {
      // É edição de linha existente

      this.dadosDespesasEmEdicao[this.indiceDespesaEmEdicao] = {
        ...this.dadosDespesasEmEdicao[this.indiceDespesaEmEdicao],
        descricao: descricao.nome,
        valor: Number(valor),
        pago: pago ?? false
      };
    }

    this.cancelarEdicao();
    this.somarValores();
  }

  // Cancela edição/adição
  cancelarEdicao() {
    this.indiceDespesaEmEdicao = -1;
    this.form.reset();
  }

  // Cancela edição/adição
  cancelarEdicaoEntrada() {
    this.indiceEntradaEmEdicao = -1;
    this.form.reset();
  }

  // Remove linha
  removerLinha(index: number) {
    if (confirm('Deseja realmente excluir esta despesa?')) {
      this.dadosDespesasEmEdicao.splice(index, 1);
      this.somarValores();
      if (this.indiceDespesaEmEdicao >= this.dadosDespesasEmEdicao.length) {
        this.indiceDespesaEmEdicao = -1;
      }
    }
  }

  // Desabilita botões de editar/excluir enquanto estiver editando ou adicionando
  botaoDesabilitado(): boolean {
    return this.indiceDespesaEmEdicao !== -1;
  }

  botaoDesabilitadoEntrada(): boolean {
    return this.indiceEntradaEmEdicao !== -1;
  }

  somarValores() {
    this.valoresSomados = this.dadosDespesasEmEdicao.reduce((acc, item) => acc + item.valor, 0);
  }

  somarValoresEntradas() {
    this.valoresEntradasSomados = this.dadosEntradas.reduce((acc, item) => acc + item.entradaValor, 0);

    console.log(this.valoresEntradasSomados);

  }

  // TrackBy para performance
  trackByIndex(index: number): number {
    return index;
  }

  salvarNoBackend() {
    if (this.dadosDespesasEmEdicao.length === 0) {
      alert('Para salvar o registro de gastos, deve adicionar uma despesa');
      return;
    }

    if (this.dadosDespesasEmEdicao.length === 0) {
      alert('Para salvar o registro de gastos, deve adicionar uma entrada');
      return;
    }


    if (!this.paramsRoute.id) {
      const paramsCadastro = {
        despesas: this.dadosDespesasEmEdicao,
        entradas: this.dadosEntradasEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: new Date(),
        mes: Number(this.paramsRoute.mes),
        ano: Number(this.paramsRoute.ano),
        usuarioId: this.authService.buscarUsuarioId()
      };

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
        despesas: this.dadosDespesasEmEdicao,
        entradas: this.dadosEntradasEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: new Date(),
        mes: Number(this.paramsRoute.mes),
        ano: Number(this.paramsRoute.ano),
        usuarioId: this.authService.buscarUsuarioId()
      };

      this.gastosService.putDespesaPeloId(this.paramsRoute.id, paramsAlteracao).subscribe(retorno => {
        alert(retorno.sucesso ? retorno.mensagem : retorno.mensagem)
      })
    }
  }

  salvarLinhaEntrada(event: Entrada) {

    if (this.estadoDaLinha === Grid.editar) {
      this.dadosEntradasEdicao.map((linha, index) => {
        if (index === linha.index) {
          return this.formEntrada.value
        }
        return linha
      });
    } else if (this.estadoDaLinha === Grid.adicionar) {
      const { entradaDescricao, entradaValor } = this.form.value;

      const adicionandoLinha = { entradaDescricao: entradaDescricao, entradaValor: Number(entradaValor) }

      this.dadosEntradasEdicao.push(adicionandoLinha);


    }
      console.log(this.dadosEntradasEdicao);

  }

  editarLinhaEntrada(event: any) {
    this.estadoDaLinha = Grid.editar
  }

excluirLinhaEntrada(event: Entrada) {

  this.dadosEntradasEdicao =
    this.dadosEntradasEdicao.filter(
      linha => linha !== event
    );

    this.dadosEntradas = [...this.dadosEntradasEdicao]
}

adicionarLinhaEntrada() {
  this.estadoDaLinha = Grid.adicionar
}

  excluir() {
    var confirmar = confirm('Deseja excluir toda a despesa??');

    if (confirmar)
      this.gastosService.deleteDespesa(this.paramsRoute.id).subscribe(retorno => {
        alert(retorno.message);
      })
  }

  voltar() {
    this.router.navigate([`/${this.paramsRoute.ano}/card-meses`]);
  }

  get formulario() {
    return this.form.controls;
  }
}
