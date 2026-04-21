import * as echarts from 'echarts/core';

import { BarChart, LineChart, PieChart, GraphChart, TreeChart, FunnelChart, ScatterChart, SankeyChart, HeatmapChart, RadarChart, GaugeChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  GaugeChart,
  RadarChart,
  HeatmapChart,
  TreeChart,
  SankeyChart,
  ScatterChart,
    FunnelChart,
    TreeChart,
    GraphChart,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);

export default echarts;