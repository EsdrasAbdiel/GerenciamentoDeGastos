import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgStyle } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { GastosService } from '../../services/gastos.service';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTooltipModule } from '@angular/material/tooltip'
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';

export interface Despesa {
  f?: number;
  id?: number;
  descricao: string;
  valor: number;
}

export interface Entrada {
  indice?: number;
  id?: number;
  entradaDescricao: string;
  entradaValor: number;
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
    NgStyle,
    MatTooltipModule,
    LoadingComponent
  ],
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss', '../../../assets/colors.scss']
})
export class DetalhesComponent implements OnInit {
  paramsRoute: any;
  form!: FormGroup;
  dadosDespesasEmEdicao: Despesa[] = [];
  dadosEntradasEmEdicao: Entrada[] = [];
  valoresSomados = 0;
  valoresEntradasSomados = 0;
  adicionarValorEntrada: boolean = false;
  entradaValor: number = 3250;
  loading = false;
  // Índice da linha sendo editada (-1 = nenhuma, ou length = nova linha no final)
  indiceDespesaEmEdicao: number = -1;
  indiceEntradaEmEdicao: number = -1;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private gastosService: GastosService,
    private activatedRoute: ActivatedRoute
  ) {
    this.paramsRoute = this.activatedRoute.snapshot.params;
    this.form = this.fb.group({
      valorSaida: [null],
      entradaValor: [null],
      descricaoEntrada: [null],
      descricao: [''],
      valor: [null]
    });
  }

  ngOnInit(): void {
    if (this.paramsRoute.id)
      this.carregarDespesasExistentes();
  }
  verificacaoValorPositivoOuNegativo(valor: number) {
    if (valor > 0) {
      return '#28A745';
    } else if (valor < 0) {
      return '#DC3545'
    } else {
      return 'none'
    }
  }

  deveSalvarValorDeEntrada() {
    this.adicionarValorEntrada = false;

    const { entradaValor, descricaoEntrada } = this.form.value;

    console.log(entradaValor, descricaoEntrada);

  }

  carregarDespesasExistentes() {
    this.loading = true;
    this.gastosService.getDespesaPeloId(this.paramsRoute.id).pipe(finalize(() => (this.loading = false))).subscribe(retorno => {
      this.dadosDespesasEmEdicao = retorno.itensDespesa.map((itensDespesa: any, index: number) => ({
        ...itensDespesa,
        indice: index
      }));

      this.dadosEntradasEmEdicao = retorno.itensEntrada.map((itensEntrada: any, index: number) => ({
        ...itensEntrada,
        indice: index
      }))
      this.somarValores();
      this.somarValoresEntrada();
    });

  }

  // Inicia edição de uma linha existente
  iniciarEdicao(index: number) {
    this.indiceDespesaEmEdicao = index;
    const item = this.dadosDespesasEmEdicao[index];
    this.form.patchValue({
      descricao: item.descricao,
      valor: item.valor
    });
  }

  iniciarEdicaoEntrada(index: number) {
    this.indiceEntradaEmEdicao = index;
    const item = this.dadosEntradasEmEdicao[index];
    this.form.patchValue({
      entradaValor: item.entradaValor,
      descricaoEntrada: item.entradaDescricao
    })
  }

  // Inicia adição de nova linha (no final)
  adicionarNovaLinha() {
    this.indiceDespesaEmEdicao = this.dadosDespesasEmEdicao.length; // coloca no final
    this.form.reset();
  }

  adicionarNovaLinhaEntrada() {
    this.indiceEntradaEmEdicao = this.dadosEntradasEmEdicao.length; // coloca no final
    this.form.reset();
  }

  gerarIdPorItemEntrada() {
    return this.dadosEntradasEmEdicao.length + 1;
  }

  gerarIdPorItemDespesa() {
    return this.dadosDespesasEmEdicao.length + 1;
  }

  // Confirma (edição ou adição)
  confirmar() {
    if (this.form.invalid) {
      alert('Preencha descrição e valor corretamente.');
      return;
    }

    const valor = this.form.value;

    if (this.indiceDespesaEmEdicao === this.dadosDespesasEmEdicao.length) {
      // É uma NOVA linha
      this.dadosDespesasEmEdicao.push({
        //id: this.gerarIdPorItemDespesa(),
        descricao: valor.descricao,
        valor: Number(valor.valor)
      });
    } else {
      // É edição de linha existente
      this.dadosDespesasEmEdicao[this.indiceDespesaEmEdicao] = {
        ...this.dadosDespesasEmEdicao[this.indiceDespesaEmEdicao],
        descricao: valor.descricao,
        valor: Number(valor.valor)
      };
    }

    this.cancelarEdicao();
    this.somarValores();
  }

  confirmarEntrada() {
    if (this.form.invalid) {
      alert('Preencha descrição e valor corretamente.');
      return;
    }

    const valor = this.form.value;

    if (this.indiceEntradaEmEdicao === this.dadosEntradasEmEdicao.length) {
      // É uma NOVA linha
      this.dadosEntradasEmEdicao.push({
        //id: this.gerarIdPorItemEntrada(),
        entradaDescricao: valor.descricaoEntrada,
        entradaValor: Number(valor.entradaValor)
      });
    } else {
      // É edição de linha existente
      this.dadosEntradasEmEdicao[this.indiceEntradaEmEdicao] = {
        ...this.dadosEntradasEmEdicao[this.indiceEntradaEmEdicao],
        entradaDescricao: valor.descricaoEntrada,
        entradaValor: Number(valor.entradaValor)
      };
    }

    this.cancelarEdicaoEntrada();
    this.somarValoresEntrada();
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

  removerLinhaEntrada(index: number) {
    if (confirm('Deseja realmente excluir esta despesa?')) {
      this.dadosEntradasEmEdicao.splice(index, 1);
      //this.somarValores();
      if (this.indiceEntradaEmEdicao >= this.dadosEntradasEmEdicao.length) {
        this.indiceEntradaEmEdicao = -1;
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

  somarValoresEntrada() {
    this.valoresEntradasSomados = this.dadosEntradasEmEdicao.reduce((acc, item) => acc + item.entradaValor, 0);
  }

  // TrackBy para performance
  trackByIndex(index: number): number {
    return index;
  }

  trackByIndexEntrada(index: number): number {
    return index;
  }

  salvarNoBackend() {
    console.log(this.dadosEntradasEmEdicao);
    console.log(this.dadosDespesasEmEdicao);


    if (!this.paramsRoute.id) {
      const paramsCadastro = {
        despesas: this.dadosDespesasEmEdicao,
        entradas: this.dadosEntradasEmEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: new Date(),
        mes: Number(this.paramsRoute.mes),
        ano: Number(this.paramsRoute.ano)
      };

      this.gastosService.postCadastroDespesas(paramsCadastro).subscribe(retorno => {
        alert(retorno.sucesso ? retorno.mensagem : retorno.mensagem);
      });
    } else {
      const paramsAlteracao = {
        id: this.paramsRoute.id,
        despesas: this.dadosDespesasEmEdicao,
        entradas: this.dadosEntradasEmEdicao,
        valorDespesaTotal: this.valoresSomados,
        valorEntradaTotal: this.valoresEntradasSomados,
        dataInclusao: new Date(),
        mes: Number(this.paramsRoute.mes),
        ano: Number(this.paramsRoute.ano)
      };

      this.gastosService.putDespesaPeloId(this.paramsRoute.id, paramsAlteracao).subscribe(retorno => {
        alert(retorno.sucesso ? retorno.mensagem : retorno.mensagem)
      })
    }
  }

  excluir() {
    this.gastosService.deleteDespesa(this.paramsRoute.id).subscribe(retorno => {
      alert(retorno.message);
    })
  }

  voltar() {
    this.router.navigate([`/${this.paramsRoute.ano}/card-meses`]);
  }
}