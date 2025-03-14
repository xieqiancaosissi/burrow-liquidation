import React from "react";
import ReactECharts from "echarts-for-react";

interface ChartComponentProps {
  title: string;
  chartOption: any;
}

export default function ChartComponent({
  title,
  chartOption,
}: ChartComponentProps) {
  return (
    <div className="px-6 pt-6 -pb-6 border border-dark-100 rounded bg-dark-650 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-300 ml-6">{title}</h2>
      <div className="w-full mt-6">
        <ReactECharts option={chartOption} style={{ height: "300px" }} />
      </div>
    </div>
  );
}
