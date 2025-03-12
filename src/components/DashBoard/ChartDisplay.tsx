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
  chartType?: "line" | "bar";
}

export default function ChartDisplay({
  data,
  colors,
  title,
  yAxes,
  chartType = "bar",
}: Props) {
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

  const getSeriesConfig = (d: number[], i: number) => ({
    data: d.slice().reverse().map(val => {
      const numericValue = Number(val);
      return parseFloat(numericValue.toFixed(6));
    }),
    type: chartType,
    smooth: false,
    symbol: chartType === "line" ? "circle" : undefined,
    symbolSize: chartType === "line" ? 4 : undefined,
    lineStyle:
      chartType === "line"
        ? {
            width: 2,
          }
        : undefined,
    itemStyle: {
      color: colors[i],
      borderRadius: chartType === "bar" ? [5, 5, 0, 0] : 0,
    },
  });

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
          result += `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>${param.value}<br/>`;
        });
        return result;
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "#333",
      textStyle: { color: "#C0C4E9", fontSize: 12 },
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
    yAxis: yAxes || [
      {
        type: "value",
        splitLine: {
          show: false,
        },
      },
    ],
    series: Array.isArray(data.data[0])
      ? (data.data as number[][]).map((d, i) => getSeriesConfig(d, i))
      : [getSeriesConfig(data.data as number[], 0)],
    grid: {
      show: true,
      borderColor: "transparent",
      borderWidth: 0,
    },
  };

  return <ReactECharts option={option} />;
}
