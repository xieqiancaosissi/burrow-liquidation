import React, { useState, useEffect, useCallback } from "react";
import { getDashBoardData, getBotDashBoardData } from "@/services/api";
import { BeatLoading } from "../Loading";
import ChartComponent from "./ChartComponent";
import { getChartOption } from "./getChartOption";
import { TimeUnit, ChartData } from "./types";
import { useDashboard } from "@/context/DashboardContext";
import {
  processRevenueBreakdownData,
  processIncentivesBreakdownData,
  processNewUsersData,
  processNewMemeData,
  processHitData,
  processTradeCountData,
  processTradeVolumeData,
  processTradeRewardData,
  processSocialShareData,
  formatTime
} from "./chartUtils";

interface BotDataPoint {
  time: number;
  value: number;
}

interface BotData {
  botTradeCount: BotDataPoint[];
  botTradeAmount: BotDataPoint[];
  totalUserNumber: number[];
  totalLikeNumber: number[];
}

export default function TimeBasedChart() {
  const { toggleComponent } = useDashboard();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hour");
  const [isDataComplete, setIsDataComplete] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [botData, setBotData] = useState<BotData>({
    botTradeCount: [],
    botTradeAmount: [],
    totalUserNumber: [],
    totalLikeNumber: [],
  });
  const [isAllDataReady, setIsAllDataReady] = useState(false);

  useEffect(() => {
    if (chartData.length > 0 && botData.botTradeCount.length > 0) {
      setIsAllDataReady(true);
    } else {
      setIsAllDataReady(false);
    }
  }, [chartData, botData]);

  useEffect(() => {
    let allData: any[] = [];
    setLoading(true);
    setIsDataComplete(false);
    setIsAllDataReady(false);

    const fetchAllData = async () => {
      try {
        const batchSize = 100;
        const totalNeeded = (() => {
          switch (timeUnit) {
            case "hour":
              return 30; // 30 hours
            case "day":
              return 30 * 24; // 30 days (data per hour)
            case "week":
              // Need to get more data to ensure we have 30 weeks
              // 1 week = 7 days * 24 hours = 168 hours
              // 30 weeks = 30 * 168 = 5040 hours
              // To ensure we have at least one sample per week, we need 5040 data points
              return 60 * 24 * 7; // 60 weeks of hourly data to ensure we have 30 weeks
            default:
              return 30;
          }
        })();
        
        // Calculate the number of API calls needed
        const batchCount = Math.ceil(totalNeeded / batchSize);
        
        const promises = Array.from({ length: batchCount }, (_, i) =>
          getDashBoardData(batchSize, i + 1)
        );
        
        const responses = await Promise.all(promises);
        
        // Count valid data points received
        let validDataCount = 0;
        const mergedData = responses.reduce((acc, res) => {
          if (res?.data?.data) {
            validDataCount += res.data.data.length;
            return [...acc, ...res.data.data];
          }
          return acc;
        }, []);
        
        // Ensure data is sorted by time
        const sortedData = mergedData.sort((a: any, b: any) => b.epoch_create_time - a.epoch_create_time);
        
        // Remove duplicate data
        const uniqueData = Array.from(
          new Map(
            sortedData.map((item: any) => [item.epoch_create_time, item])
          ).values()
        );
        
        // Show earliest and latest data points
        if (uniqueData.length > 0) {
          const earliestTime = Math.min(...uniqueData.map((item: any) => item.epoch_create_time));
          const latestTime = Math.max(...uniqueData.map((item: any) => item.epoch_create_time));
        }
        
        setData(uniqueData as any[]);
        setIsDataComplete(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchAllData();
    // Reduce refresh frequency to avoid excessive API requests
    // Temporarily disabled auto-refresh
    // const intervalId = setInterval(fetchAllData, 5 * 60000); // Refresh every 5 minutes
    // return () => clearInterval(intervalId);
  }, [timeUnit]);

  useEffect(() => {
    if (!data.length || !isDataComplete) {
      setChartData([]);
      return;
    }

    const timestamps = data.map((item) => item.epoch_create_time * 1000);
    const latestTime = Math.max(...timestamps);
    const now = new Date(latestTime);
    const startTime = new Date(now);

    switch (timeUnit) {
      case "hour":
        startTime.setHours(startTime.getHours() - 29);
        break;
      case "day":
        startTime.setDate(startTime.getDate() - 29);
        break;
      case "week":
        startTime.setDate(startTime.getDate() - 7 * 29); // 30 weeks
        break;
    }

    const periodData = data
      .filter((item) => item.epoch_create_time * 1000 >= startTime.getTime())
      .sort((a, b) => a.epoch_create_time - b.epoch_create_time);

    // Group data by hour
    if (timeUnit === "hour") {
      const timeGroups = new Map();
      
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setMinutes(0, 0, 0);
        const key = date.getTime();

        if (!timeGroups.has(key)) {
          timeGroups.set(key, {
            time: date.getTime() / 1000,
            ...item,
          });
        }
      });
      
      const sortedGroups = Array.from(timeGroups.values()).sort(
        (a, b) => a.time - b.time
      );
      setChartData(sortedGroups);
    } 
    // Group data by day
    else if (timeUnit === "day") {
      const timeGroups = new Map();
      
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setHours(0, 0, 0, 0);
        const key = date.getTime();

        if (!timeGroups.has(key)) {
          timeGroups.set(key, {
            time: date.getTime() / 1000,
            ...item,
          });
        }
      });
      
      const sortedGroups = Array.from(timeGroups.values()).sort(
        (a, b) => a.time - b.time
      );
      setChartData(sortedGroups);
    } 
    // Group data by week
    else {
      const timeGroups = new Map();
      
      // First check data spans
      const earliestDate = new Date(Math.min(...periodData.map(item => item.epoch_create_time * 1000)));
      const latestDate = new Date(Math.max(...periodData.map(item => item.epoch_create_time * 1000)));
      
      // Generate week start dates without filling data
      const weekStartDates: Date[] = [];
      const endWeekDate = new Date(latestDate);
      // Adjust end date to the Monday of current week
      const endDayOfWeek = endWeekDate.getDay();
      const endDaysToAdjust = endDayOfWeek === 0 ? 6 : endDayOfWeek - 1;
      endWeekDate.setDate(endWeekDate.getDate() - endDaysToAdjust);
      endWeekDate.setHours(0, 0, 0, 0);
      
      // Generate 30 week start dates (each Monday)
      for (let i = 0; i < 30; i++) {
        const weekStart = new Date(endWeekDate);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        weekStartDates.push(weekStart);
      }
      
      // Reverse to sort from earliest to latest
      weekStartDates.reverse();
      
      // Create a mapping to assign each data point to its corresponding week
      // Only use actual data, no derived/filled values
      periodData.forEach((item) => {
        const itemDate = new Date(item.epoch_create_time * 1000);
        
        // Find which week this data point belongs to
        let matchingWeekStart = null;
        for (let i = weekStartDates.length - 1; i >= 0; i--) {
          if (itemDate >= weekStartDates[i]) {
            matchingWeekStart = weekStartDates[i];
            break;
          }
        }
        
        // If no matching week is found, it means the data point is before the earliest week, ignore it
        if (!matchingWeekStart) return;
        
        const key = matchingWeekStart.getTime();
        
        // Only store the first encountered data point for each week
        // This prevents overwriting with later data in the same week
        if (!timeGroups.has(key)) {
          timeGroups.set(key, {
            time: matchingWeekStart.getTime() / 1000,
            ...item,
            week: `${matchingWeekStart.toISOString().split('T')[0]}`,
          });
        }
      });
      
      // No filling of missing weeks - only use weeks where we have data
      const sortedGroups = Array.from(timeGroups.values()).sort(
        (a, b) => a.time - b.time
      );
      
      // Take the most recent weeks up to 30, but don't fill missing weeks
      if (sortedGroups.length > 30) {
        const originalLength = sortedGroups.length;
        sortedGroups.splice(0, sortedGroups.length - 30);
      }
      
      setChartData(sortedGroups);
    }
  }, [data, isDataComplete, timeUnit]);

  // Extract X-axis data (time)
  const xAxisData = chartData.map((d) => d.time);

  // Process chart data
  const revenueBreakdownData = processRevenueBreakdownData(chartData);
  const incentivesBreakdownData = processIncentivesBreakdownData(chartData);
  const newMemeData = processNewMemeData(chartData);
  const hitData = processHitData(chartData);
  const tradeCountData = processTradeCountData(chartData);
  const tradeVolumeData = processTradeVolumeData(chartData);
  const tradeRewardData = processTradeRewardData(chartData);
  const socialShareData = processSocialShareData(chartData);

  // User data from bot API
  const userData = [
    {
      name: "New Users",
      data: botData.totalUserNumber,
      color: "#FF6384",
    },
  ];

  // Fetch bot data for user statistics
  const fetchBotData = useCallback(async () => {
    try {
      // Use the same time range as the main data
      const mainDataPoints = chartData.map((d) => ({
        start: d.time * 1000,
        end:
          (d.time +
            (() => {
              switch (timeUnit) {
                case "hour":
                  return 60 * 60; // 1 hour
                case "day":
                  return 24 * 60 * 60; // 1 day
                case "week":
                  return 7 * 24 * 60 * 60; // 1 week
              }
            })()) *
          1000,
      }));

      // Ensure bot data matches the main data time points exactly
      const results = await Promise.all(
        mainDataPoints.map((point) =>
          getBotDashBoardData(point.end.toString(), point.start.toString())
        )
      );

      // Process bot data to ensure it matches the main data format - keep original data without filling
      const botDataPoints = results.map((res, index) => ({
        time: mainDataPoints[index].start,
        totalAmount: res?.data?.total_amount || 0,
        totalNumber: res?.data?.total_number || 0,
        totalUserNumber: res?.data?.total_user_number || 0,
        totalLikeNumber: res?.data?.total_like_number || 0,
      }));

      // Set bot data directly without filling missing data points
      setBotData({
        botTradeCount: botDataPoints.map((d) => ({
          time: d.time,
          value: d.totalNumber,
        })),
        botTradeAmount: botDataPoints.map((d) => ({
          time: d.time,
          value: d.totalAmount,
        })),
        totalUserNumber: botDataPoints.map((d) => d.totalUserNumber),
        totalLikeNumber: botDataPoints.map((d) => d.totalLikeNumber),
      });
    } catch (error) {
      // Error handling
    }
  }, [chartData, timeUnit]);

  useEffect(() => {
    if (chartData.length > 0) {
      fetchBotData();
    }
  }, [chartData, fetchBotData]);

  return (
    <div className="text-white">
      {loading || !isAllDataReady ? (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => toggleComponent()}
              className="p-2 text-white rounded cursor-pointer"
            >
              {"<"} Switch to Algorithm Performance
            </button>
            <div className="flex bg-dark-650 rounded-lg p-1 gap-1">
              {["Hour", "Day", "Week"].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setTimeUnit(unit.toLowerCase() as TimeUnit)}
                  className={`
                    px-6 py-2 rounded-md font-medium transition-all
                    ${
                      timeUnit === unit.toLowerCase()
                        ? "bg-[#fbca04] text-black shadow-md"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }
                  `}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          
          {/* Section 1: Revenue and Incentives */}
          <h2 className="text-2xl font-bold text-center mt-4">Revenue and Incentives</h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="Revenues Breakdown"
              chartOption={getChartOption(xAxisData, revenueBreakdownData, timeUnit)}
            />
            <ChartComponent
              title="Incentives Breakdown"
              chartOption={getChartOption(xAxisData, incentivesBreakdownData, timeUnit)}
            />
          </div>
          
          {/* Section 2: Users and MEME */}
          <h2 className="text-2xl font-bold text-center mt-4">Users and MEME</h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="New Users"
              chartOption={getChartOption(xAxisData, userData, timeUnit)}
            />
            <ChartComponent
              title="New Memes"
              chartOption={getChartOption(xAxisData, newMemeData, timeUnit)}
            />
          </div>
          
          {/* Section 3: MEME HIT */}
          <h2 className="text-2xl font-bold text-center mt-4">MEME HIT</h2>
          <div className="grid grid-cols-1 gap-6">
            <ChartComponent
              title="New Hits"
              chartOption={getChartOption(xAxisData, hitData, timeUnit)}
            />
          </div>
          
          {/* Section 4: Trading */}
          <h2 className="text-2xl font-bold text-center mt-4">Trading</h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="Trade Count"
              chartOption={getChartOption(xAxisData, tradeCountData, timeUnit)}
            />
            <ChartComponent
              title="Trade Volume"
              chartOption={getChartOption(xAxisData, tradeVolumeData, timeUnit)}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 mt-4">
            <ChartComponent
              title="Trade Rewards"
              chartOption={getChartOption(xAxisData, tradeRewardData, timeUnit)}
            />
          </div>
          
          {/* Section 5: Social Sharing (only for weekly view) */}
          {timeUnit === "week" && (
            <>
              <h2 className="text-2xl font-bold text-center mt-4">Social Sharing</h2>
              <div className="grid grid-cols-1 gap-6">
                <ChartComponent
                  title="Social Sharing"
                  chartOption={getChartOption(xAxisData, socialShareData, timeUnit)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
