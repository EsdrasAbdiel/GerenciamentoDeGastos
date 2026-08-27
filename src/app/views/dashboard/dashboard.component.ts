import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import { EChartsOption } from 'echarts/types/dist/shared';
import { MatCardModule } from '@angular/material/card';
import { echarts } from '../../../assets/echarts';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ECharts } from 'echarts/core';
import { DespesaItem, MesDashboard, ResumoFinanceiroMensal } from '../../models';
import { AuthService, CalendarioService, DashboardService } from '../../services';
import { LoadingSkeletonDashboardComponent, LoadingSkeletonComponent, DatePickerComponent, MenuComponent } from '../../components';
import { graficoBarraHorizontalDashboard, graficoBarraVerticalDashboard } from '../../utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoadingSkeletonDashboardComponent, LoadingSkeletonComponent, DatePickerComponent, MenuComponent, CommonModule, NgxEchartsModule, MatCardModule, MatIconModule, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule],
  providers: [
    provideEchartsCore({ echarts })
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private calendarioService = inject(CalendarioService);
  private authService = inject(AuthService);

  form!: FormGroup;
  valorEntrada = 0;
  valorSaida = 0;
  valorSaldo = 0;
  quantidadeRegistros = 0;
  buscaPersonalizada = false;
  loading!: boolean;
  registros: ResumoFinanceiroMensal[] = [];
  anoAtual: number = new Date().getFullYear();
  mesAtual!: number;
  mesesDashboard: MesDashboard[] = [];
  despesasPorCategoria: string[] = [];
  semDados = false;

  ano2025: ResumoFinanceiroMensal[] = [];
  ano2026: ResumoFinanceiroMensal[] = [];

  despesas: number[] = [];

  dadosXAxis: string[] = [];

  chartOptionComparativo!: EChartsOption;
  barOption!: EChartsOption;

  graficoBarraVerticalDashboard = graficoBarraVerticalDashboard;
  graficoBarraHorizontalDashboard = graficoBarraHorizontalDashboard;

  readonly anos = toSignal(this.calendarioService.getAnos(), { initialValue: [] });
  readonly meses = toSignal(this.calendarioService.getMesesDashboard(), { initialValue: [] });

  pickerAberto: 'mes' | 'ano' | null = null;

  chartInstance: ECharts | null = null;

  onChartInit(ec: ECharts) {
    this.chartInstance = ec;
  }


  togglePicker(tipo: 'mes' | 'ano'): void {
    this.pickerAberto = this.pickerAberto === tipo ? null : tipo;
  }

  ngOnInit(): void {
    this.carregarDadosCalendario();
    this.carregarInformacoes();
  }

  carregarDadosCalendario() {
    this.calendarioService.getMesesDashboard().subscribe(retorno => {
      this.mesesDashboard = retorno;
    });
  }

  carregarInformacoes() {
    this.loading = true;
    this.dashboardService.dashboard(this.authService.buscarUsuarioId()).subscribe(retorno => {
      const dashboard = retorno;

      this.valorEntrada = dashboard.totalEntradas;
      this.valorSaida = dashboard.totalDespesas;
      this.valorSaldo = dashboard.totalSaldo;
      this.quantidadeRegistros = dashboard.quantidadeRegistro;
      this.registros = dashboard.registros;

      this.ano2025 = dashboard.registros.filter((r: ResumoFinanceiroMensal) => r.ano === (this.anoAtual - 1)).sort((a: ResumoFinanceiroMensal, b: ResumoFinanceiroMensal) => a.mes - b.mes);
      this.ano2026 = dashboard.registros.filter((r: ResumoFinanceiroMensal) => r.ano === this.anoAtual).sort((a: ResumoFinanceiroMensal, b: ResumoFinanceiroMensal) => a.mes - b.mes);



      this.dadosAnos(this.anoAtual);

      this.loading = false;

      setTimeout(() => {
        this.chartInstance?.resize();
      });



    });
  }

  carregarGraficoComparativo(itensDespesas: number[], itensEntradas: number[], dataXAxis: string[], semDados: boolean) {
    this.chartOptionComparativo = this.graficoBarraVerticalDashboard(itensDespesas, itensEntradas, dataXAxis, semDados);

    setTimeout(() => {
      this.chartInstance?.setOption(this.chartOptionComparativo, true);
      this.chartInstance?.resize();
    }, 0);
  }

  carregarGraficoDespesasPorCategoria(categorias: string[], valoresDespesas: number[], semDados: boolean) {
    this.barOption = this.graficoBarraHorizontalDashboard(categorias, valoresDespesas, semDados);
  }

  dadosMes(mes: MesDashboard) {
    const resumoDoMes = this.buscarResumoDoMes(mes.id);
    let semDados = false;

    if (!resumoDoMes) {
      this.resetarDados();
      this.carregarGraficoComparativo([0], [0], [], true);
      this.carregarGraficoDespesasPorCategoria([], [], true);
      semDados = true;
      return;
    }

    const despesas = this.ordernarDespesasPorValor(resumoDoMes.itensDespesa ?? []);
    const entradas = resumoDoMes.itensEntrada ?? [];

    const despesasPorCategoria = this.mapearDespesasPorCategoria(despesas, d => d.descricao);

    const itensDespesas = this.mapearValoresPorMes(despesas, d => d.valor);

    const itensEntradas = this.mapearValoresPorMes(entradas, d => d.entradaValor);

    const itensEntradasSomados = this.somarItensPorMes(itensEntradas);
    const itensDespesasSomados = this.somarItensPorMes(itensDespesas);
    const dadosXAxis = this.mesesDashboard.filter((m: MesDashboard) => m.id === this.mesAtual).map((mes: MesDashboard) => mes.nomeAbreviado);


    this.valorEntrada = itensEntradasSomados;
    this.valorSaida = itensDespesasSomados;
    this.valorSaldo = (itensEntradasSomados - itensDespesasSomados);
    this.quantidadeRegistros = 1;

    this.carregarGraficoComparativo([itensDespesasSomados], [itensEntradasSomados], dadosXAxis, semDados);
    this.carregarGraficoDespesasPorCategoria(despesasPorCategoria, itensDespesas, semDados);
  }

  dadosAnos(ano: number) {
    const resumoDoAno = this.filtrarResumoPorAno(ano);
    let semDados = false;

    if (!resumoDoAno?.length) {
      this.resetarDados();
      this.carregarGraficoComparativo([0], [0], [], true);
      this.carregarGraficoDespesasPorCategoria([], [], true);
      semDados = true;
      return;
    }

    const despesas = resumoDoAno.flatMap(resumo => resumo.itensDespesa ?? []);

    const { categorias, valores } = this.agruparESomarDespesas(despesas);

    const itensDespesas = resumoDoAno.map(resumo =>
      this.somarItensPorMes(
        this.mapearValoresPorMes(resumo.itensDespesa ?? [], d => d.valor)
      )
    );

    const itensEntradas = resumoDoAno.map(resumo =>
      this.somarItensPorMes(
        this.mapearValoresPorMes(resumo.itensEntrada ?? [], d => d.entradaValor)
      )
    );

    const itensEntradasSomados = this.somarItensPorMes(itensEntradas);
    const itensDespesasSomados = this.somarItensPorMes(itensDespesas);

    const dadosXAxis = resumoDoAno.map((resumo: ResumoFinanceiroMensal) => {
      const mes = this.mesesDashboard.find((m: MesDashboard) => m.id === resumo.mes);
      return mes?.nomeAbreviado ?? '';
    });

    this.valorEntrada = itensEntradasSomados;
    this.valorSaida = itensDespesasSomados;
    this.valorSaldo = itensEntradasSomados - itensDespesasSomados;
    this.quantidadeRegistros = resumoDoAno.length;

    this.carregarGraficoComparativo(itensDespesas, itensEntradas, dadosXAxis, semDados);
    this.carregarGraficoDespesasPorCategoria(categorias, valores, semDados);
  }

  agruparESomarDespesas(despesas: DespesaItem[]) {
    const mapa = new Map<string, number>();

    despesas.forEach(d => {
      mapa.set(d.descricao, (mapa.get(d.descricao) ?? 0) + d.valor);
    });

    return Array.from(mapa.entries())
      .sort((a, b) => a[1] - b[1])
      .reduce(
        (acc, [categoria, valor]) => {
          acc.categorias.push(categoria);
          acc.valores.push(valor);
          return acc;
        },
        { categorias: [] as string[], valores: [] as number[] }
      );
  }

  private mapearValoresPorMes<T>(itens: T[], selector: (item: T) => number): number[] {
    return itens.map(selector);
  }

private mapearDespesasPorCategoria(
  itens: DespesaItem[],
  selector: (item: DespesaItem) => string
): string[] {
  return itens.map(selector);
}

  private somarItensPorMes(itens: number[]) {
    return itens.reduce((total: number, valor: number) => total + valor, 0);
  }

  private buscarResumoDoMes(mes: number): ResumoFinanceiroMensal | undefined {
    return this.ano2026.find((registro: ResumoFinanceiroMensal) => registro.mes === mes);
  }

  private filtrarResumoPorAno(ano: number): ResumoFinanceiroMensal[] {
    this.ano2026 = this.registros.filter((r: ResumoFinanceiroMensal) => r.ano === ano).sort((a: ResumoFinanceiroMensal, b: ResumoFinanceiroMensal) => a.mes - b.mes);
    return this.ano2026.filter(r => r.ano === ano);
  }

  private ordernarDespesasPorValor(despesas: DespesaItem[]): DespesaItem[] {
    return [...despesas].sort((a: DespesaItem, b: DespesaItem) => a.valor - b.valor);
  }

  private resetarDados() {
    this.valorEntrada = 0;
    this.valorSaida = 0;
    this.valorSaldo = 0;
    this.quantidadeRegistros = 0;
  }
}

