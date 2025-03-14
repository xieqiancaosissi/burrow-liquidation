import { getDashBoardData } from "@/services/api";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { BeatLoading } from "./Loading";
import AlgorithmPerformance from "./DashBoard/AlgorithmPerformance";
import StatisticTrendCharts from "./DashBoard/StatisticTrendCharts";
import TimeBasedChart from "./DashBoard/TimeBasedChart";
import { DashboardContext } from "@/context/DashboardContext";

const PASSWORD = "FlipN2025";

export default function DashBoardPage() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const savedState = localStorage.getItem("currentPage");
    return savedState || "algorithm";
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");

  const toggleComponent = () => {
    const nextPage = {
      algorithm: "statistic",
      statistic: "timebased",
      timebased: "algorithm",
    }[currentPage] as string;

    setCurrentPage(nextPage);
    localStorage.setItem("currentPage", nextPage);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setIsModalVisible(false);
    }
    if (isModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalVisible]);

  const handleLogin = () => {
    if (password === PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
      setIsModalVisible(false);
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="p-4">
      <DashboardContext.Provider value={{ toggleComponent }}>
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 overflow-hidden">
            <div className="bg-dark-200 p-6 rounded shadow-md">
              <input
                type="text"
                value={password}
                style={{
                  width: "100%",
                }}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-style"
              />
              <button
                onClick={handleLogin}
                className="bg-[#d2ff3a] text-black p-2 rounded w-full mt-4"
              >
                Log in
              </button>
            </div>
          </div>
        )}
        {localStorage.getItem("isLoggedIn") === "true" &&
          (currentPage === "algorithm" ? (
            <AlgorithmPerformance />
          ) : currentPage === "statistic" ? (
            <StatisticTrendCharts />
          ) : (
            <TimeBasedChart />
          ))}
      </DashboardContext.Provider>
    </div>
  );
}
