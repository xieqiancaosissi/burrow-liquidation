import React from 'react';
import ReactECharts from 'echarts-for-react';

interface Props {
  data: number[];
  colors?: string[];
}

export default function ChartDisplay({ data, colors }: Props) {
  const seriesType = 'line';

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          show: true,
          type: ['line', 'bar']
        }
      },
      iconStyle: {
        borderColor: '#fff'
      }
    },
    xAxis: {
      type: 'category',         
      data: Array.from({ length: data.length }, (_, i) => `${i + 1}`),
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [{
      data,
      type: seriesType,
      smooth: true,
      symbol: seriesType === 'line' ? 'circle' : undefined,
      symbolSize: seriesType === 'line' ? [0, 0] : undefined,
      itemStyle: {
        color: colors?.[0],
        borderRadius: [5, 5, 0, 0]
      },
      areaStyle: {
        color: {
          type: 'linearGradient',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors?.[0] },
            { offset: 1, color: 'rgb(20,22,43)' }
          ]
        }
      }
    }],
    grid: {
      show: false
    }
  };

  return <ReactECharts option={option} />;
} 