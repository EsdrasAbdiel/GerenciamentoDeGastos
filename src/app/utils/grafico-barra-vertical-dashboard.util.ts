import { EChartsOption } from 'echarts/types/dist/shared';

export function graficoBarraVerticalDashboard(itensDespesas: number[], itensEntradas: number[], dataXAxis: string[], semDados: boolean): EChartsOption {
	return {
		title: {
			text: 'Despesas x Entradas',
			textStyle: {
				color: '#ffffff',
				fontSize: '14px'
			}
		},
		tooltip: {
			trigger: 'axis',
			textStyle: {
				color: 'black',
				fontSize: '14px'
			}
		},

		legend: {
			data: ['Despesas', 'Entradas'],
			textStyle: {
				fontSize: '14px',
				color: '#ffff'
			}
		},
		grid: {
			left: '3%',
			right: '3%',
			top: '15%',
			bottom: '12%',
			containLabel: true
		},
		xAxis: semDados ? undefined : {
			type: 'category',
			data: dataXAxis,
			axisLabel: {
				fontSize: '14px',
				color: '#ffff'
			}
		},

		yAxis: semDados ? undefined : {
			type: 'value',
			axisLabel: {
				color: '#ffff',
				fontSize: '14px'
			}
		},

		series: semDados ? [] : [
			{
				name: 'Despesas',
				type: 'bar',
				data: itensDespesas,
				color: '#C62828'
			},
			{
				name: 'Entradas',
				type: 'bar',
				data: itensEntradas,
				color: '#5fbf62'
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
