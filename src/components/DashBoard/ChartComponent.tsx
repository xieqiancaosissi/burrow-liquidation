import React from "react";
import ReactECharts from "echarts-for-react";

interface ChartComponentProps {
  title: string;
  chartOption: any;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  title,
  chartOption,
}) => {
  return (
    <div className="bg-dark-200 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-purple-50">{title}</h3>
      <div className="h-72">
        <ReactECharts
          option={chartOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
