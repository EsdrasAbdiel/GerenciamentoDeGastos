import { EChartsOption } from "echarts/types/dist/shared";

  export function graficoBarraHorizontalDashboard(categorias: string[], valoresDespesas: number[], semDados: boolean): EChartsOption {
    const dadosOrdenados = categorias
      .map((categoria, index) => ({
        categoria,
        valor: valoresDespesas[index]
      }))
      .sort((a, b) => b.valor - a.valor);

    return {
      title: {
        text: 'Despesas por categoria',
        left: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: '1rem'
        }
      },
      tooltip: semDados ? undefined : {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            color: '#000',
            fontSize: '1rem'
          }
        }
      },
      grid: {
        left: '20%',
        right: '10%',
        top: '20%',
        bottom: '10%'
      },
      xAxis: semDados ? undefined : {
        type: 'value',
        axisLabel: {
          color: '#ffffff',
          fontSize: '1rem'
        }
      },
      yAxis: semDados ? undefined : {
        type: 'category',
        data: dadosOrdenados.map(item => item.categoria),
        axisLabel: {
          color: '#ffffff',
          fontSize: '1rem'
        }
      },
      series: semDados ? [] : [
        {
          type: 'bar',
          data: dadosOrdenados.map(item => item.valor),
          label: {
            show: true,
            position: 'right',
            color: '#ffffff',
            formatter: 'R$ {c}',
            fontSize: '1rem'
          }
        }
      ],
      graphic: semDados ? [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: 'Sem dados para exibir',
            fontSize: 20,
            fill: '#999',
          }
        }
      ] : undefined
    };
  }
