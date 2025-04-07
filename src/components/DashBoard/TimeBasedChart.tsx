import React, { useState, useEffect, useCallback } from "react";
import { getDashBoardData, getBotDashBoardData } from "@/services/api";
import { BeatLoading } from "../Loading";
import ChartComponent from "./ChartComponent";
import { getChartOption } from "./getChartOption";
import { TimeUnit, DataItem, ChartData } from "./types";
import { useDashboard } from "@/context/DashboardContext";

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
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hour");
  const [isDataComplete, setIsDataComplete] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [botData, setBotData] = useState<BotData>({
    botTradeCount: [],
    botTradeAmount: [],
    totalUserNumber: [],
    totalLikeNumber: [],
  });
  const [isAllDataReady, setIsAllDataReady] = useState(false);

  useEffect(() => {
    let allData: DataItem[] = [];
    setLoading(true);
    setIsDataComplete(false);
    setIsAllDataReady(false);

    const fetchAllData = async () => {
      try {
        const batchSize = 100;
        const totalNeeded = (() => {
          switch (timeUnit) {
            case "hour":
              return 24 * 6; // 30 hours
            case "day":
              return 30 * 24 * 6; // 30 days
            case "week":
              return 30 * 7 * 24 * 6; // 30 weeks
            default:
              return 24 * 6;
          }
        })();

        const batchCount = Math.ceil(totalNeeded / batchSize);
        const promises = Array.from({ length: batchCount }, (_, i) =>
          getDashBoardData(batchSize, i + 1)
        );
        const responses = await Promise.all(promises);
        const mergedData = responses.reduce((acc, res) => {
          if (res?.data?.data) {
            return [...acc, ...res.data.data];
          }
          return acc;
        }, []);
        const uniqueData = Array.from(
          new Map(
            mergedData.map((item: DataItem) => [item.epoch_create_time, item])
          ).values()
        );
        setData(uniqueData as DataItem[]);
        setIsDataComplete(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
    const intervalId = setInterval(fetchAllData, 60000);
    return () => clearInterval(intervalId);
  }, [timeUnit]);

  useEffect(() => {
    if (chartData.length > 0 && botData.botTradeCount.length > 0) {
      setIsAllDataReady(true);
    } else {
      setIsAllDataReady(false);
    }
  }, [chartData, botData]);

  useEffect(() => {
    if (!data.length || !isDataComplete) {
      setChartData([]);
      return;
    }

    const timestamps = data.map((item) => item.epoch_create_time * 1000);
    const latestTime = Math.max(...timestamps);
    const now = new Date(Math.max(...timestamps));
    const startTime = new Date(now);

    switch (timeUnit) {
      case "hour":
        startTime.setMinutes(0, 0, 0);
        startTime.setHours(startTime.getHours() - 23);
        break;
      case "day":
        startTime.setHours(0, 0, 0, 0);
        startTime.setDate(startTime.getDate() - 6);
        break;
      case "week":
        startTime.setHours(0, 0, 0, 0);
        const dayOfWeek = startTime.getDay();
        startTime.setDate(startTime.getDate() - dayOfWeek);
        startTime.setDate(startTime.getDate() - 3 * 7);
        break;
    }

    const periodData = data
      .filter((item) => item.epoch_create_time * 1000 >= startTime.getTime())
      .sort((a, b) => a.epoch_create_time - b.epoch_create_time);

    let aggregatedData: ChartData[] = [];

    if (timeUnit === "hour") {
      const timeGroups = new Map();
      
      // First, group data points by hour
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setMinutes(0, 0, 0);
        const key = date.getTime();

        if (!timeGroups.has(key)) {
          timeGroups.set(key, {
            time: date.getTime() / 1000,
            revenue: 0,
            tokenValue: 0,
            tradeReward: 0,
            creatorReward: 0,
            launchedReward: 0,
            likeReward: 0,
            count: 0,
            memeCreated: 0,
            memeLaunched: 0,
            memeLaunching: 0,
            totalUsers: 0,
            likeUsers: 0,
            flipUsers: 0,
            tradeUsers: 0,
            tradeCount: 0,
            tradeAmount: 0,
            likeCount: 0,
            tradeFlipReward: 0,
            tradePumpReward: 0,
          });
        }

        const group = timeGroups.get(key);
        group.revenue += parseFloat(item.epoch_revenue);
        group.tokenValue += parseFloat(item.epoch_reward_value);
        group.tradeReward += parseFloat(item.epoch_trade_reward);
        group.creatorReward += parseFloat(item.epoch_launched_creator_reward);
        group.launchedReward +=
          parseFloat(item.epoch_launched_reward) -
          parseFloat(item.epoch_launched_creator_reward);
        group.likeReward += parseFloat(item.epoch_like_reward);
        group.count += 1;
        group.memeCreated += parseFloat(item.epoch_meme_created_count);
        group.memeLaunched += parseFloat(item.epoch_meme_launched_count);
        group.memeLaunching += parseFloat(item.epoch_meme_launching_count);
        group.totalUsers = parseFloat(item.total_user_count);
        group.likeUsers += parseFloat(item.epoch_like_user_count);
        group.flipUsers += parseFloat(item.epoch_flip_user_count);
        group.tradeUsers += parseFloat(item.epoch_trade_user_count);
        group.tradeCount += parseFloat(item.epoch_trade_count);
        group.tradeAmount += parseFloat(item.epoch_trade_amount);
        group.likeCount += parseFloat(item.epoch_like_count);
        group.tradeFlipReward += parseFloat(item.epoch_trade_flip_reward);
        group.tradePumpReward += parseFloat(item.epoch_trade_pump_reward);
      });
      
      // Find the last data point for each hour
      const lastDataPointByHour = new Map();
      
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setMinutes(0, 0, 0);
        const key = date.getTime();
        
        if (!lastDataPointByHour.has(key) || lastDataPointByHour.get(key).timestamp < item.epoch_create_time) {
          lastDataPointByHour.set(key, {
            timestamp: item.epoch_create_time,
            item: item
          });
        }
      });
      
      // Add the last data point from each hour to the next hour's data
      const sortedHours = Array.from(timeGroups.keys()).sort();
      
      for (let i = 0; i < sortedHours.length - 1; i++) {
        const currentHourKey = sortedHours[i];
        const nextHourKey = sortedHours[i + 1];
        
        const lastDataPoint = lastDataPointByHour.get(currentHourKey);
        
        if (lastDataPoint) {
          const item = lastDataPoint.item;
          const group = timeGroups.get(nextHourKey);
          
          // Add the last data point from the previous hour to the current hour
          group.revenue += parseFloat(item.epoch_revenue);
          group.tokenValue += parseFloat(item.epoch_reward_value);
          group.tradeReward += parseFloat(item.epoch_trade_reward);
          group.creatorReward += parseFloat(item.epoch_launched_creator_reward);
          group.launchedReward +=
            parseFloat(item.epoch_launched_reward) -
            parseFloat(item.epoch_launched_creator_reward);
          group.likeReward += parseFloat(item.epoch_like_reward);
          group.count += 1;
          group.memeCreated += parseFloat(item.epoch_meme_created_count);
          group.memeLaunched += parseFloat(item.epoch_meme_launched_count);
          group.memeLaunching += parseFloat(item.epoch_meme_launching_count);
          group.totalUsers = parseFloat(item.total_user_count);
          group.likeUsers += parseFloat(item.epoch_like_user_count);
          group.flipUsers += parseFloat(item.epoch_flip_user_count);
          group.tradeUsers += parseFloat(item.epoch_trade_user_count);
          group.tradeCount += parseFloat(item.epoch_trade_count);
          group.tradeAmount += parseFloat(item.epoch_trade_amount);
          group.likeCount += parseFloat(item.epoch_like_count);
          group.tradeFlipReward += parseFloat(item.epoch_trade_flip_reward);
          group.tradePumpReward += parseFloat(item.epoch_trade_pump_reward);
        }
      }
      
      // Output the number of data points for each hour for debugging
      const hoursWithData = Array.from(timeGroups.entries())
        .map(([timestamp, group]) => {
          const date = new Date(timestamp);
          return {
            hour: `${date.getHours()}:00`,
            count: group.count,
            revenue: group.revenue,
            tradeCount: group.tradeCount
          };
        });
      
      // Check if there are any data points that were not assigned to any hour group
      const finalAssignedDataPoints = Array.from(timeGroups.values()).reduce((sum, group) => sum + group.count, 0);

      const sortedGroups = Array.from(timeGroups.values()).sort(
        (a, b) => a.time - b.time
      );
      aggregatedData = sortedGroups;
    } else if (timeUnit === "day") {
      const timeGroups = new Map();
      
      // First, group data points by day
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setHours(0, 0, 0, 0);
        const key = date.getTime();

        if (!timeGroups.has(key)) {
          timeGroups.set(key, {
            time: date.getTime() / 1000,
            timestamp: date.setMinutes(0, 0, 0),
            revenue: 0,
            tokenValue: 0,
            tradeReward: 0,
            creatorReward: 0,
            launchedReward: 0,
            likeReward: 0,
            count: 0,
            memeCreated: 0,
            memeLaunched: 0,
            memeLaunching: 0,
            totalUsers: 0,
            likeUsers: 0,
            flipUsers: 0,
            tradeUsers: 0,
            tradeCount: 0,
            tradeAmount: 0,
            likeCount: 0,
            tradeFlipReward: 0,
            tradePumpReward: 0,
          });
        }

        const group = timeGroups.get(key);
        group.revenue += parseFloat(item.epoch_revenue);
        group.tokenValue += parseFloat(item.epoch_reward_value);
        group.tradeReward += parseFloat(item.epoch_trade_reward);
        group.creatorReward += parseFloat(item.epoch_launched_creator_reward);
        group.launchedReward +=
          parseFloat(item.epoch_launched_reward) -
          parseFloat(item.epoch_launched_creator_reward);
        group.likeReward += parseFloat(item.epoch_like_reward);
        group.count += 1;
        group.memeCreated += parseFloat(item.epoch_meme_created_count);
        group.memeLaunched += parseFloat(item.epoch_meme_launched_count);
        group.memeLaunching += parseFloat(item.epoch_meme_launching_count);
        group.totalUsers = parseFloat(item.total_user_count);
        group.likeUsers += parseFloat(item.epoch_like_user_count);
        group.flipUsers += parseFloat(item.epoch_flip_user_count);
        group.tradeUsers += parseFloat(item.epoch_trade_user_count);
        group.tradeCount += parseFloat(item.epoch_trade_count);
        group.tradeAmount += parseFloat(item.epoch_trade_amount);
        group.likeCount += parseFloat(item.epoch_like_count);
        group.tradeFlipReward += parseFloat(item.epoch_trade_flip_reward);
        group.tradePumpReward += parseFloat(item.epoch_trade_pump_reward);
      });
      
      // Find the last data point for each day
      const lastDataPointByDay = new Map();
      
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setHours(0, 0, 0, 0);
        const key = date.getTime();
        
        if (!lastDataPointByDay.has(key) || lastDataPointByDay.get(key).timestamp < item.epoch_create_time) {
          lastDataPointByDay.set(key, {
            timestamp: item.epoch_create_time,
            item: item
          });
        }
      });
      
      // Add the last data point from each day to the next day's data
      const sortedDays = Array.from(timeGroups.keys()).sort();
      
      for (let i = 0; i < sortedDays.length - 1; i++) {
        const currentDayKey = sortedDays[i];
        const nextDayKey = sortedDays[i + 1];
        
        const lastDataPoint = lastDataPointByDay.get(currentDayKey);
        
        if (lastDataPoint) {
          const item = lastDataPoint.item;
          const group = timeGroups.get(nextDayKey);
          
          // Add the last data point from the previous day to the current day
          group.revenue += parseFloat(item.epoch_revenue);
          group.tokenValue += parseFloat(item.epoch_reward_value);
          group.tradeReward += parseFloat(item.epoch_trade_reward);
          group.creatorReward += parseFloat(item.epoch_launched_creator_reward);
          group.launchedReward +=
            parseFloat(item.epoch_launched_reward) -
            parseFloat(item.epoch_launched_creator_reward);
          group.likeReward += parseFloat(item.epoch_like_reward);
          group.count += 1;
          group.memeCreated += parseFloat(item.epoch_meme_created_count);
          group.memeLaunched += parseFloat(item.epoch_meme_launched_count);
          group.memeLaunching += parseFloat(item.epoch_meme_launching_count);
          group.totalUsers = parseFloat(item.total_user_count);
          group.likeUsers += parseFloat(item.epoch_like_user_count);
          group.flipUsers += parseFloat(item.epoch_flip_user_count);
          group.tradeUsers += parseFloat(item.epoch_trade_user_count);
          group.tradeCount += parseFloat(item.epoch_trade_count);
          group.tradeAmount += parseFloat(item.epoch_trade_amount);
          group.likeCount += parseFloat(item.epoch_like_count);
          group.tradeFlipReward += parseFloat(item.epoch_trade_flip_reward);
          group.tradePumpReward += parseFloat(item.epoch_trade_pump_reward);
        }
      }

      const sortedGroups = Array.from(timeGroups.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      );
      aggregatedData = sortedGroups;
    } else {
      const timeGroups = new Map();
      
      // First, group data points by week
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setHours(0, 0, 0, 0);
        const dayOfWeek = date.getDay();
        date.setDate(date.getDate() - dayOfWeek);
        const key = date.getTime();

        if (!timeGroups.has(key)) {
          timeGroups.set(key, {
            time: date.getTime() / 1000,
            timestamp: new Date(date.setHours(0, 0, 0, 0)).getTime(),
            revenue: 0,
            tokenValue: 0,
            tradeReward: 0,
            creatorReward: 0,
            launchedReward: 0,
            likeReward: 0,
            count: 0,
            memeCreated: 0,
            memeLaunched: 0,
            memeLaunching: 0,
            totalUsers: 0,
            likeUsers: 0,
            flipUsers: 0,
            tradeUsers: 0,
            tradeCount: 0,
            tradeAmount: 0,
            likeCount: 0,
            tradeFlipReward: 0,
            tradePumpReward: 0,
          });
        }

        const group = timeGroups.get(key);
        group.revenue += parseFloat(item.epoch_revenue);
        group.tokenValue += parseFloat(item.epoch_reward_value);
        group.tradeReward += parseFloat(item.epoch_trade_reward);
        group.creatorReward += parseFloat(item.epoch_launched_creator_reward);
        group.launchedReward +=
          parseFloat(item.epoch_launched_reward) -
          parseFloat(item.epoch_launched_creator_reward);
        group.likeReward += parseFloat(item.epoch_like_reward);
        group.count += 1;
        group.memeCreated += parseFloat(item.epoch_meme_created_count);
        group.memeLaunched += parseFloat(item.epoch_meme_launched_count);
        group.memeLaunching += parseFloat(item.epoch_meme_launching_count);
        group.totalUsers = parseFloat(item.total_user_count);
        group.likeUsers += parseFloat(item.epoch_like_user_count);
        group.flipUsers += parseFloat(item.epoch_flip_user_count);
        group.tradeUsers += parseFloat(item.epoch_trade_user_count);
        group.tradeCount += parseFloat(item.epoch_trade_count);
        group.tradeAmount += parseFloat(item.epoch_trade_amount);
        group.likeCount += parseFloat(item.epoch_like_count);
        group.tradeFlipReward += parseFloat(item.epoch_trade_flip_reward);
        group.tradePumpReward += parseFloat(item.epoch_trade_pump_reward);
      });
      
      // Find the last data point for each week
      const lastDataPointByWeek = new Map();
      
      periodData.forEach((item) => {
        const date = new Date(item.epoch_create_time * 1000);
        date.setHours(0, 0, 0, 0);
        const dayOfWeek = date.getDay();
        date.setDate(date.getDate() - dayOfWeek);
        const key = date.getTime();
        
        if (!lastDataPointByWeek.has(key) || lastDataPointByWeek.get(key).timestamp < item.epoch_create_time) {
          lastDataPointByWeek.set(key, {
            timestamp: item.epoch_create_time,
            item: item
          });
        }
      });
      
      // Add the last data point from each week to the next week's data
      const sortedWeeks = Array.from(timeGroups.keys()).sort();
      
      for (let i = 0; i < sortedWeeks.length - 1; i++) {
        const currentWeekKey = sortedWeeks[i];
        const nextWeekKey = sortedWeeks[i + 1];
        
        const lastDataPoint = lastDataPointByWeek.get(currentWeekKey);
        
        if (lastDataPoint) {
          const item = lastDataPoint.item;
          const group = timeGroups.get(nextWeekKey);
          
          // Add the last data point from the previous week to the current week
          group.revenue += parseFloat(item.epoch_revenue);
          group.tokenValue += parseFloat(item.epoch_reward_value);
          group.tradeReward += parseFloat(item.epoch_trade_reward);
          group.creatorReward += parseFloat(item.epoch_launched_creator_reward);
          group.launchedReward +=
            parseFloat(item.epoch_launched_reward) -
            parseFloat(item.epoch_launched_creator_reward);
          group.likeReward += parseFloat(item.epoch_like_reward);
          group.count += 1;
          group.memeCreated += parseFloat(item.epoch_meme_created_count);
          group.memeLaunched += parseFloat(item.epoch_meme_launched_count);
          group.memeLaunching += parseFloat(item.epoch_meme_launching_count);
          group.totalUsers = parseFloat(item.total_user_count);
          group.likeUsers += parseFloat(item.epoch_like_user_count);
          group.flipUsers += parseFloat(item.epoch_flip_user_count);
          group.tradeUsers += parseFloat(item.epoch_trade_user_count);
          group.tradeCount += parseFloat(item.epoch_trade_count);
          group.tradeAmount += parseFloat(item.epoch_trade_amount);
          group.likeCount += parseFloat(item.epoch_like_count);
          group.tradeFlipReward += parseFloat(item.epoch_trade_flip_reward);
          group.tradePumpReward += parseFloat(item.epoch_trade_pump_reward);
        }
      }

      const sortedGroups = Array.from(timeGroups.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      );
      aggregatedData = sortedGroups;
    }

    setChartData(aggregatedData);
  }, [data, isDataComplete, timeUnit]);

  const xAxisData = chartData.map((d) => d.time);
  const revenueData = [
    {
      name: "Revenue",
      data: chartData.map((d) => d.revenue),
      color: "#FF6384",
    },
    {
      name: "Token Value",
      data: chartData.map((d) => d.tokenValue),
      color: "#36A2EB",
    },
  ];

  const incentivesData = [
    {
      name: "Trade Reward",
      data: chartData.map((d) => d.tradeReward || 0),
      color: "#FF9F40",
    },
    {
      name: "Creator Reward",
      data: chartData.map((d) => d.creatorReward || 0),
      color: "#4BC0C0",
    },
    {
      name: "Launched Reward",
      data: chartData.map((d) => Math.max(d.launchedReward || 0, 0)),
      color: "#9966FF",
    },
    {
      name: "Like Reward",
      data: chartData.map((d) => d.likeReward || 0),
      color: "#36A2EB",
    },
  ];

  const memeData = [
    {
      name: "Created",
      data: chartData.map((d) => d.memeCreated || 0),
      color: "#FF6384",
    },
    {
      name: "Launching",
      data: chartData.map((d) => d.memeLaunching || 0),
      color: "#9966FF",
    },
    {
      name: "Launched",
      data: chartData.map((d) => d.memeLaunched || 0),
      color: "#4BC0C0",
    },
  ];

  const userData = [
    {
      name: "New Users",
      data: botData.totalUserNumber,
      color: "#FF6384",
    },
  ];

  const userActivityData = [
    {
      name: "Like Users",
      data: chartData.map((d) => d.likeUsers || 0),
      color: "#FF9F40",
    },
    {
      name: "Flip Users",
      data: chartData.map((d) => d.flipUsers || 0),
      color: "#36A2EB",
    },
    {
      name: "Trade Users",
      data: chartData.map((d) => d.tradeUsers || 0),
      color: "#4BC0C0",
    },
  ];

  const tradeCountData = [
    {
      name: "Total Trade Count",
      data: chartData.map((d) => d.tradeCount || 0),
      color: "#FF6384",
    },
    {
      name: "Bot Trade Count",
      data: botData.botTradeCount.map((d) => d.value),
      color: "#4BC0C0",
    },
    {
      name: "Human Trade Count",
      data: chartData.map((d, index) => {
        const botValue = botData.botTradeCount[index]?.value || 0;
        return Math.max((d.tradeCount || 0) - botValue, 0);
      }),
      color: "#FF9F40",
    },
  ];

  const tradeAmountData = [
    {
      name: "Total Trade Amount",
      data: chartData.map((d) => d.tradeAmount || 0),
      color: "#FF6384",
    },
    {
      name: "Bot Trade Amount",
      data: botData.botTradeAmount.map((d) => d.value / 1e9),
      color: "#4BC0C0",
    },
    {
      name: "Human Trade Amount",
      data: chartData.map((d, index) => {
        const botValue = botData.botTradeAmount[index]?.value || 0;
        return Math.max((d.tradeAmount || 0) - (botValue / 1e9), 0);
      }),
      color: "#FF9F40",
    },
  ];

  const likeCountData = [
    {
      name: "Like Count",
      data: chartData.map((d) => d.likeCount || 0),
      color: "#FF9F40",
    },
  ];

  const likeUserCountData = [
    {
      name: "Like Users",
      data: botData.totalLikeNumber,
      color: "#36A2EB",
    },
  ];

  const tradeRewardData = [
    {
      name: "Internal Tokens",
      data: chartData.map((d) => d.tradeFlipReward || 0),
      color: "#FF9F40",
    },
    {
      name: "External Tokens",
      data: chartData.map((d) => d.tradePumpReward || 0),
      color: "#36A2EB",
    },
  ];

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

      // Process bot data to ensure it matches the main data format
      const botDataPoints = results.map((res, index) => ({
        time: mainDataPoints[index].start,
        totalAmount: res?.data?.total_amount || 0,
        totalNumber: res?.data?.total_number || 0,
        totalUserNumber: res?.data?.total_user_number || 0,
        totalLikeNumber: res?.data?.total_like_number || 0,
      }));

      // Check for missing data points and fill them with values from the previous data point
      const filledBotDataPoints = botDataPoints.map((point, index) => {
        if (point.totalAmount === 0 && point.totalNumber === 0 && index > 0) {
          // If the current data point has no data, use the values from the previous data point
          return {
            ...point,
            totalAmount: botDataPoints[index - 1].totalAmount,
            totalNumber: botDataPoints[index - 1].totalNumber,
            totalUserNumber: botDataPoints[index - 1].totalUserNumber,
            totalLikeNumber: botDataPoints[index - 1].totalLikeNumber,
          };
        }
        return point;
      });

      // Set bot data to ensure synchronization with main data
      setBotData({
        botTradeCount: filledBotDataPoints.map((d) => ({
          time: d.time,
          value: d.totalNumber,
        })),
        botTradeAmount: filledBotDataPoints.map((d) => ({
          time: d.time,
          value: d.totalAmount,
        })),
        totalUserNumber: filledBotDataPoints.map((d) => d.totalUserNumber),
        totalLikeNumber: filledBotDataPoints.map((d) => d.totalLikeNumber),
      });
    } catch (error) {
      // console.error("Error fetching bot data:", error);
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
          <h2 className="text-2xl font-bold text-center">
            Revenue & Incentives Overview
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="Revenue and Incentives"
              chartOption={getChartOption(xAxisData, revenueData, timeUnit)}
            />
            <ChartComponent
              title="Incentives Breakdown"
              chartOption={getChartOption(xAxisData, incentivesData, timeUnit)}
            />
          </div>
          <h2 className="text-2xl font-bold text-center">MEME tokens</h2>
          <div className="grid grid-cols-1">
            <ChartComponent
              title="MEME Tokens Status"
              chartOption={getChartOption(xAxisData, memeData, timeUnit)}
            />
          </div>
          <h2 className="text-2xl font-bold text-center">Users</h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="Newly added users"
              chartOption={getChartOption(xAxisData, userData, timeUnit)}
            />
            <ChartComponent
              title="User Activities"
              chartOption={getChartOption(
                xAxisData,
                userActivityData,
                timeUnit
              )}
            />
          </div>
          <h2 className="text-2xl font-bold text-center">Trading</h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="Trade Count"
              chartOption={getChartOption(xAxisData, tradeCountData, timeUnit)}
            />
            <ChartComponent
              title="Trade Amount"
              chartOption={getChartOption(xAxisData, tradeAmountData, timeUnit)}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6">
            <ChartComponent
              title="Trade Rewards"
              chartOption={getChartOption(xAxisData, tradeRewardData, timeUnit)}
            />
          </div>
          <h2 className="text-2xl font-bold text-center">Liking</h2>
          <div className="grid grid-cols-2 gap-6">
            <ChartComponent
              title="Like Count"
              chartOption={getChartOption(xAxisData, likeCountData, timeUnit)}
            />
            <ChartComponent
              title="Like Users"
              chartOption={getChartOption(
                xAxisData,
                likeUserCountData,
                timeUnit
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
