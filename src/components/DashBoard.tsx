import { getDashBoardData } from "@/services/api";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { BeatLoading } from "./Loading";
import AlgorithmPerformance from "./DashBoard/AlgorithmPerformance";
import StatisticTrendCharts from "./DashBoard/StatisticTrendCharts";

export default function DashBoardPage() {
  const [isComponentAVisible, setIsComponentAVisible] = useState<boolean>(() => {
    const savedState = localStorage.getItem("isComponentAVisible");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  const toggleComponent = () => {
    setIsComponentAVisible(!isComponentAVisible);
  };

  useEffect(() => {
    localStorage.setItem("isComponentAVisible", JSON.stringify(isComponentAVisible));
  }, [isComponentAVisible]);

  const labelA = "< Switch to Algorithm Performance";
  const labelB = "Switch to Statistic Trend Charts >";

  return (
    <div className="p-4">
      <button onClick={toggleComponent} className="mb-4 p-2 text-white rounded">
        {isComponentAVisible ? `${labelB}` : `${labelA}`}
      </button>
      {isComponentAVisible ? (  
        <AlgorithmPerformance />
      ) : (
        <StatisticTrendCharts />
      )}
    </div>
  );
}
