import React from "react";
import ReactECharts from "echarts-for-react";
import { BeatLoading } from "../Loading";

export type TimeUnit = "hour" | "day" | "week";

interface BaseChartProps {
  loading: boolean;
  timeUnit: TimeUnit;
  setTimeUnit: (unit: TimeUnit) => void;
  title: string;
  chartOption: any;
  className?: string;
}

export default function BaseChart({
  loading,
  timeUnit,
  setTimeUnit,
  title,
  chartOption,
  className = "",
}: BaseChartProps) {
  return (
    <div className={`text-white ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoading />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeUnit("hour")}
              className={`px-3 py-1 rounded ${
                timeUnit === "hour" ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              Hour
            </button>
            <button
              onClick={() => setTimeUnit("day")}
              className={`px-3 py-1 rounded ${
                timeUnit === "day" ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeUnit("week")}
              className={`px-3 py-1 rounded ${
                timeUnit === "week" ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              Week
            </button>
          </div>
          <div className="px-4 py-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-300">{title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <ReactECharts option={chartOption} style={{ height: "400px" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
