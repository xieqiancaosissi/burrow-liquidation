import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

interface Props {
  data: {
    data: number[] | number[][];
    epochIds: number[];
  };
  colors: string[];
  title: string;
  yAxes?: any[];
}

export default function ChartDisplay({ data, colors, title, yAxes }: Props) {
  const [seriesType, setSeriesType] = useState<"line" | "bar">("bar");

  const isAllZero = Array.isArray(data.data[0])
    ? (data.data as number[][]).every((arr) =>
        arr.every((val) => parseFloat(val as any) === 0 || val === 0)
      )
    : (data.data as number[]).every(
        (val) => parseFloat(val as any) === 0 || val === 0
      );

  if (isAllZero) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-dark-600 rounded">
        <div className="text-xl font-bold mb-2 text-gray-300">{title}</div>
        <span className="text-gray-400">No Data</span>
      </div>
    );
  }

  const option = {
    title: {
      text: title,
      left: "center",
      top: 0,
      textStyle: {
        color: "rgb(209 213 219)",
        fontSize: 18,
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        const epochId =
          data.epochIds[data.epochIds.length - 1 - params[0].dataIndex];
        let result = `EpochId ${epochId}<br/>`;
        params.forEach((param: any) => {
          result += `${param.value}<br/>`;
        });
        return result;
      },
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          show: true,
          type: ["line", "bar"],
          onclick: () => {
            setSeriesType((prevType) => (prevType === "line" ? "bar" : "line"));
          },
        },
      },
      iconStyle: {
        borderColor: "#fff",
      },
    },
    xAxis: {
      type: "category",
      data: Array.from(
        {
          length: Array.isArray(data.data[0])
            ? data.data[0].length
            : data.data.length,
        },
        (_, i) => ``
      ),
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "value",
        // name: "Value",
        splitLine: {
          show: false,
        },
      },
      {
        type: "value",
        // name: "Points",
        splitLine: {
          show: false,
        },
      },
    ],
    series: Array.isArray(data.data[0])
      ? (data.data as number[][]).map((d, i) => ({
          data: d.slice().reverse(),
          type: seriesType,
          yAxisIndex: i,
          smooth: seriesType === "line",
          symbol: seriesType === "line" ? "circle" : undefined,
          symbolSize: seriesType === "line" ? [0, 0] : undefined,
          itemStyle: {
            color: colors[i],
            borderRadius: [5, 5, 0, 0],
          },
          areaStyle: {
            color: {
              type: "linearGradient",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[i] },
                { offset: 1, color: "rgb(20,22,43)" },
              ],
            },
          },
        }))
      : [
          {
            data: (data.data as number[]).slice().reverse(),
            type: seriesType,
            smooth: seriesType === "line",
            symbol: seriesType === "line" ? "circle" : undefined,
            symbolSize: seriesType === "line" ? [0, 0] : undefined,
            itemStyle: {
              color: colors[0],
              borderRadius: [5, 5, 0, 0],
            },
            areaStyle: {
              color: {
                type: "linearGradient",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colors[0] },
                  { offset: 1, color: "rgb(20,22,43)" },
                ],
              },
            },
          },
        ],
    grid: {
      show: true,
      borderColor: "transparent",
      borderWidth: 0,
    },
  };

  return <ReactECharts option={option} />;
}
