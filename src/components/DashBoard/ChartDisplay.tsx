import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

interface Props {
  data: number[] | number[][];
  colors?: string[];
  title?: string;
  yAxes?: { position: string }[];
}

export default function ChartDisplay({ data, colors, title, yAxes }: Props) {
  const [seriesType, setSeriesType] = useState<"line" | "bar">("line");

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
        { length: Array.isArray(data[0]) ? data[0].length : data.length },
        (_, i) => ` ${i}`
      ),
      splitLine: {
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
    series: Array.isArray(data[0])
      ? (data as number[][]).map((d, i) => ({
          data: d,
          type: seriesType,
          yAxisIndex: i,
          smooth: seriesType === "line",
          symbol: seriesType === "line" ? "circle" : undefined,
          symbolSize: seriesType === "line" ? [0, 0] : undefined,
          itemStyle: {
            color: colors?.[i],
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
                { offset: 0, color: colors?.[i] },
                { offset: 1, color: "rgb(20,22,43)" },
              ],
            },
          },
        }))
      : [
          {
            data: data as number[],
            type: seriesType,
            smooth: seriesType === "line",
            symbol: seriesType === "line" ? "circle" : undefined,
            symbolSize: seriesType === "line" ? [0, 0] : undefined,
            itemStyle: {
              color: colors?.[0],
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
                  { offset: 0, color: colors?.[0] },
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
