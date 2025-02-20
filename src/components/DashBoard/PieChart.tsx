import React from "react";
import ReactECharts from "echarts-for-react";

interface PieChartProps {
  data: number[];
  labels: string[];
  colors: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, labels, colors }) => {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "#333",
      textStyle: { color: "#C0C4E9", fontSize: 12 },
    },
    legend: {
      orient: "vertical",
      right: "25%",
      bottom: "5%",
      textStyle: { color: "#C0C4E9", fontSize: 12 },
      itemGap: 12,
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "60%"],
        center: ["40%", "60%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#14162b",
          borderWidth: 1,
        },
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 5,
        },
        data: data.map((value, index) => ({
          value,
          name: labels[index],
          itemStyle: {
            color: colors[index] || "rgba(54, 162, 235, 0.8)",
          },
        })),
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

export default PieChart;
