import { getDashBoardData } from "@/services/api";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { BeatLoading } from "./Loading";
import AlgorithmPerformance from "./DashBoard/AlgorithmPerformance";
import StatisticTrendCharts from "./DashBoard/StatisticTrendCharts";

const PASSWORD = "123456";

export default function DashBoardPage() {
  const [isComponentAVisible, setIsComponentAVisible] = useState<boolean>(
    () => {
      const savedState = localStorage.getItem("isComponentAVisible");
      return savedState !== null ? JSON.parse(savedState) : true;
    }
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");

  const toggleComponent = () => {
    setIsComponentAVisible(!isComponentAVisible);
  };

  useEffect(() => {
    localStorage.setItem(
      "isComponentAVisible",
      JSON.stringify(isComponentAVisible)
    );
  }, [isComponentAVisible]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setIsModalVisible(false);
    }
  }, []);

  const handleLogin = () => {
    if (password === PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
      setIsModalVisible(false);
    } else {
      alert("Wrong password");
    }
  };

  const labelA = "< Switch to Algorithm Performance";
  const labelB = "Switch to Statistic Trend Charts >";

  return (
    <div className="p-4">
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-dark-200 p-6 rounded shadow-md">
            <input
              type="number"
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
