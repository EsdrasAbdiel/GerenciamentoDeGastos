import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts'
import { EChartsOption } from 'echarts/types/dist/shared';
import * as echarts from 'echarts/core'
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, CommonModule, NgxEchartsDirective, MatCardModule],
  providers: [
    provideEchartsCore({ echarts })
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  ganhos: number[] = [];
  despesas: number[] = [];

  dadosXAxis: any[] = []

  chartOptionComparativo!: EChartsOption

  dadosAnosXAxis: any[] = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ]

  dadosMesXAxis: any[] = [
    'Jan'
  ]

  dadosFullXAxis: any[] = [
    'Jan',
    'Mar',
    'Abr'
  ]


  pieOption: EChartsOption = {
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 300, name: 'Casa' },
        { value: 300, name: 'Comida' },
        { value: 300, name: 'Transporte' },
      ]
    }]
  }; /** Usar esse no dashboard */



  ngOnInit(): void {
    this.dadosXAxis = this.dadosFullXAxis;
    this.ganhos = [500, 800, 300];
    this.despesas = [900, 1000, 700]

    this.carregarGraficoComparativo()

    console.log(this.dadosXAxis);

  }

  carregarGraficoComparativo() {
    this.chartOptionComparativo = {
      title: {
        text: 'Despesas x Ganhos'
      },

      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: ['Despesas', 'Ganhos']
      },

      xAxis: {
        type: 'category',
        data: this.dadosXAxis
      },

      yAxis: {
        type: 'value'
      },

      series: [
        {
          name: 'Despesas',
          type: 'bar',
          data: this.despesas
        },
        {
          name: 'Ganhos',
          type: 'bar',
          data: this.ganhos
        }
      ]
    }; /** Usar esse no dashboard */
  }


  dadosMes() {
    this.dadosXAxis = this.dadosMesXAxis;
    this.ganhos = [500];
    this.despesas = [900]

    this.carregarGraficoComparativo();
  }


  dadosAnos() {
    this.dadosXAxis = this.dadosAnosXAxis;
    this.ganhos = [500, 800, 300];
    this.despesas = [900, 1000, 700]
    this.carregarGraficoComparativo();
  }

  dadosFull() {
    this.dadosXAxis = this.dadosFullXAxis;
    this.ganhos = [500, 800, 300];
    this.despesas = [900, 1000, 700]
    this.carregarGraficoComparativo();
  }

}

