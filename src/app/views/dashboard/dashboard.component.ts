import { MesDashboard } from '../../models/mes-dashboard.model';
import { finalize } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts'
import { EChartsOption } from 'echarts/types/dist/shared';
import { MatCardModule } from '@angular/material/card';
import { echarts } from '../../../assets/echarts'
import { DashboardService } from '../../services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { Dashboard } from '../../models/dashboard.model';
import { ResumoFinanceiroMensal } from '../../models/resumo-financeiro-mensal.model';
import { DespesaItem } from '../../models/despesaItem.model';
import { CalendarioService } from '../../services/calendario.service';
import { Despesa } from '../detalhes/detalhes.component';
import { DatePickerComponent } from '../../components/data-picker/date-picker.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Ano } from '../../models/ano.model';
import { AuthService } from '../../services/auth.service';
import { graficoBarraVerticalDashboard } from '../../utils/grafico-barra-vertical-dashboard.util';
import { graficoBarraHorizontalDashboard } from '../../utils/grafico-barra-horizontal.dashboard.utils';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';
import { LoadingSkeletonDashboardComponent } from '../../components/loading-skeleton-dashboard/loading-skeleton-dashboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoadingSkeletonDashboardComponent, LoadingSkeletonComponent, DatePickerComponent, MenuComponent, CommonModule, NgxEchartsModule, MatCardModule, MatIconModule, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule, LoadingComponent],
  providers: [
    provideEchartsCore({ echarts })
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class HomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private calendarioService = inject(CalendarioService);
  private authService = inject(AuthService);

  constructor() { }

  form!: FormGroup;
  valorEntrada: number = 0;
  valorSaida: number = 0;
  valorSaldo: number = 0;
  quantidadeRegistros: number = 0;
  buscaPersonalizada: boolean = false;
  loading!: boolean;
  registros: any[] = [];
  anoAtual: number = new Date().getFullYear();
  mesAtual!: number;
  mesesDashboard: MesDashboard[] = [];
  despesasPorCategoria: string[] = [];
  semDados: boolean = false;

  ano2025: ResumoFinanceiroMensal[] = [];
  ano2026: any[] = [];

  despesas: number[] = [];

  dadosXAxis: any[] = []

  chartOptionComparativo!: EChartsOption;
  barOption!: EChartsOption

  graficoBarraVerticalDashboard = graficoBarraVerticalDashboard;
  graficoBarraHorizontalDashboard = graficoBarraHorizontalDashboard;

  readonly anos = toSignal(this.calendarioService.getAnos(), { initialValue: [] })
  readonly meses = toSignal(this.calendarioService.getMesesDashboard(), { initialValue: [] })

  pickerAberto: 'mes' | 'ano' | null = null;

  chartInstance: any;

  onChartInit(ec: any) {
    this.chartInstance = ec;
  }


  togglePicker(tipo: 'mes' | 'ano'): void {
    this.pickerAberto = this.pickerAberto === tipo ? null : tipo;
  }

  ngOnInit(): void {
    this.carregarDadosCalendario()
    this.carregarInformacoes();
  }

  carregarDadosCalendario() {
    this.calendarioService.getMesesDashboard().subscribe(retorno => {
      this.mesesDashboard = retorno
    })
  }

  carregarInformacoes() {
    this.loading = true;
    this.dashboardService.dashboard(this.authService.buscarUsuarioId()).subscribe((retorno: Dashboard) => {

      this.valorEntrada = retorno.totalEntradas;
      this.valorSaida = retorno.totalDespesas;
      this.valorSaldo = retorno.totalSaldo;
      this.quantidadeRegistros = retorno.quantidadeRegistro;
      this.registros = retorno.registros

      this.ano2025 = retorno.registros.filter((r: ResumoFinanceiroMensal) => r.ano === (this.anoAtual - 1)).sort((a: any, b: any) => a.mes - b.mes);
      this.ano2026 = retorno.registros.filter((r: ResumoFinanceiroMensal) => r.ano === this.anoAtual).sort((a: any, b: any) => a.mes - b.mes);



      this.dadosAnos(this.anoAtual);

      this.loading = false;

      setTimeout(() => {
        this.chartInstance?.resize();
      });



    })
  }

  carregarGraficoComparativo(itensDespesas: number[], itensEntradas: number[], dataXAxis: string[], semDados: boolean) {
    this.chartOptionComparativo = this.graficoBarraVerticalDashboard(itensDespesas, itensEntradas, dataXAxis, semDados)

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
    var semDados = false;

    if (!resumoDoMes) {
      this.resetarDados();
      this.carregarGraficoComparativo([0], [0], [], true);
      this.carregarGraficoDespesasPorCategoria([], [], true);
      semDados = true
      return;
    }

    const despesas = this.ordernarDespesasPorValor(resumoDoMes.itensDespesa ?? []);
    const entradas = resumoDoMes.itensEntrada ?? [];

    const despesasPorCategoria = this.mapearDespesasPorCategoria(despesas, d => d.descricao);

    const itensDespesas = this.mapearValoresPorMes(despesas, d => d.valor);

    const itensEntradas = this.mapearValoresPorMes(entradas, d => d.entradaValor);

    const itensEntradasSomados = this.somarItensPorMes(itensEntradas);
    const itensDespesasSomados = this.somarItensPorMes(itensDespesas);
    const dadosXAxis = this.mesesDashboard.filter((m: MesDashboard) => m.id === this.mesAtual).map((mes: MesDashboard) => mes.nomeAbreviado)


    this.valorEntrada = itensEntradasSomados;
    this.valorSaida = itensDespesasSomados;
    this.valorSaldo = (itensEntradasSomados - itensDespesasSomados);
    this.quantidadeRegistros = 1;

    this.carregarGraficoComparativo([itensDespesasSomados], [itensEntradasSomados], dadosXAxis, semDados);
    this.carregarGraficoDespesasPorCategoria(despesasPorCategoria, itensDespesas, semDados)
  }

  dadosAnos(ano: number) {
    const resumoDoAno = this.filtrarResumoPorAno(ano);
    var semDados = false;

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

  private mapearDespesasPorCategoria(itens: DespesaItem[], selector: (item: Despesa) => string): string[] {
    return itens.map(selector);
  }

  private somarItensPorMes(itens: number[]) {
    return itens.reduce((total: any, valor: any) => total + valor, 0)
  }

  private buscarResumoDoMes(mes: number): ResumoFinanceiroMensal | undefined {
    return this.ano2026.find((registro: ResumoFinanceiroMensal) => registro.mes === mes);
  }

  private filtrarResumoPorAno(ano: number): ResumoFinanceiroMensal[] {
    this.ano2026 = this.registros.filter((r: ResumoFinanceiroMensal) => r.ano === ano).sort((a: any, b: any) => a.mes - b.mes);
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

