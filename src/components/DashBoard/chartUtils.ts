import { TimeUnit } from "./types";

// Process revenue breakdown data
export const processRevenueBreakdownData = (chartData: any[]) => {
  return [
    {
      name: "Total Revenue",
      data: chartData.map((d) => parseFloat(d.epoch_revenue || 0)),
      color: "#FF6384",
    },
    {
      name: "Raydium Revenue",
      data: chartData.map((d) => parseFloat(d.epoch_raydium_revenue || 0)),
      color: "#36A2EB",
    },
    {
      name: "Meteora Revenue",
      data: chartData.map((d) => parseFloat(d.epoch_meteora_revenue || 0)),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Revenue",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_revenue || 0) -
          parseFloat(d.epoch_raydium_revenue || 0) -
          parseFloat(d.epoch_meteora_revenue || 0)
      ),
      color: "#9966FF",
    },
  ];
};

// Process incentives breakdown data
export const processIncentivesBreakdownData = (chartData: any[]) => {
  return [
    {
      name: "Total Incentives",
      data: chartData.map((d) => {
        const tradeReward = parseFloat(d.epoch_trade_reward || 0);
        const creatorReward = parseFloat(d.epoch_launched_creator_reward || 0);
        return tradeReward + creatorReward;
      }),
      color: "#FF6384",
    },
    {
      name: "Raydium Incentives",
      data: chartData.map((d) => parseFloat(d.epoch_trade_raydium_reward || 0)),
      color: "#36A2EB",
    },
    {
      name: "Meteora Incentives",
      data: chartData.map((d) => parseFloat(d.epoch_trade_meteora_reward || 0)),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Incentives",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_trade_flip_reward || 0) +
          parseFloat(d.epoch_launched_creator_reward || 0) -
          parseFloat(d.epoch_launched_raydium_creator_reward || 0) -
          parseFloat(d.epoch_launched_meteora_creator_reward || 0)
      ),
      color: "#9966FF",
    },
  ];
};

// Process new users data
export const processNewUsersData = (chartData: any[]) => {
  return [
    {
      name: "New Users",
      data: chartData.map((d) => parseFloat(d.epoch_user_count || 0)),
      color: "#FF6384",
    },
  ];
};

// Process new meme data
export const processNewMemeData = (chartData: any[]) => {
  return [
    {
      name: "Total New Memes",
      data: chartData.map((d) => parseFloat(d.epoch_meme_created_count || 0)),
      color: "#FF6384",
    },
    {
      name: "Raydium Memes",
      data: chartData.map((d) =>
        parseFloat(d.epoch_meme_raydium_launched_count || 0)
      ),
      color: "#36A2EB",
    },
    {
      name: "Meteora Memes",
      data: chartData.map((d) =>
        parseFloat(d.epoch_meme_meteora_launched_count || 0)
      ),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Memes",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_meme_created_count || 0) -
          parseFloat(d.epoch_meme_raydium_launched_count || 0) -
          parseFloat(d.epoch_meme_meteora_launched_count || 0)
      ),
      color: "#9966FF",
    },
  ];
};

// Process HIT data
export const processHitData = (chartData: any[]) => {
  return [
    {
      name: "Total Hits",
      data: chartData.map((d) => parseFloat(d.epoch_meme_launched_count || 0)),
      color: "#FF6384",
    },
    {
      name: "Raydium Hits",
      data: chartData.map((d) =>
        parseFloat(d.epoch_meme_raydium_launched_count || 0)
      ),
      color: "#36A2EB",
    },
    {
      name: "Meteora Hits",
      data: chartData.map((d) =>
        parseFloat(d.epoch_meme_meteora_launched_count || 0)
      ),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Hits",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_meme_launched_count || 0) -
          parseFloat(d.epoch_meme_raydium_launched_count || 0) -
          parseFloat(d.epoch_meme_meteora_launched_count || 0)
      ),
      color: "#9966FF",
    },
  ];
};

// Process trade count data
export const processTradeCountData = (chartData: any[]) => {
  return [
    {
      name: "Total Trades",
      data: chartData.map((d) => parseFloat(d.epoch_trade_count || 0)),
      color: "#FF6384",
    },
    {
      name: "Raydium Trades",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_raydium_trade_buy_count || 0) +
          parseFloat(d.epoch_raydium_trade_sell_count || 0)
      ),
      color: "#36A2EB",
    },
    {
      name: "Meteora Trades",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_meteora_trade_buy_count || 0) +
          parseFloat(d.epoch_meteora_trade_sell_count || 0)
      ),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Trades",
      data: chartData.map((d) => parseFloat(d.epoch_flip_count || 0)),
      color: "#9966FF",
    },
    {
      name: "External Trades",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_pump_trade_buy_count || 0) +
          parseFloat(d.epoch_pump_trade_sell_count || 0)
      ),
      color: "#FFCD56",
    },
  ];
};

// Process trade volume data
export const processTradeVolumeData = (chartData: any[]) => {
  return [
    {
      name: "Total Volume",
      data: chartData.map((d) => parseFloat(d.epoch_trade_amount || 0)),
      color: "#FF6384",
    },
    {
      name: "Raydium Volume",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_raydium_trade_buy_amount || 0) +
          parseFloat(d.epoch_raydium_trade_sell_amount || 0)
      ),
      color: "#36A2EB",
    },
    {
      name: "Meteora Volume",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_meteora_trade_buy_amount || 0) +
          parseFloat(d.epoch_meteora_trade_sell_amount || 0)
      ),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Volume",
      data: chartData.map((d) => parseFloat(d.epoch_flip_amount || 0)),
      color: "#9966FF",
    },
    {
      name: "External Volume",
      data: chartData.map(
        (d) =>
          parseFloat(d.epoch_pump_trade_buy_amount || 0) +
          parseFloat(d.epoch_pump_trade_sell_amount || 0)
      ),
      color: "#FFCD56",
    },
  ];
};

// Process trade reward data
export const processTradeRewardData = (chartData: any[]) => {
  return [
    {
      name: "Total Rewards",
      data: chartData.map((d) => parseFloat(d.epoch_trade_reward || 0)),
      color: "#FF6384",
    },
    {
      name: "Raydium Rewards",
      data: chartData.map((d) => parseFloat(d.epoch_trade_raydium_reward || 0)),
      color: "#36A2EB",
    },
    {
      name: "Meteora Rewards",
      data: chartData.map((d) => parseFloat(d.epoch_trade_meteora_reward || 0)),
      color: "#4BC0C0",
    },
    {
      name: "FlipN Rewards",
      data: chartData.map((d) => parseFloat(d.epoch_trade_flip_reward || 0)),
      color: "#9966FF",
    },
    {
      name: "External Rewards",
      data: chartData.map((d) => parseFloat(d.epoch_trade_pump_reward || 0)),
      color: "#FFCD56",
    },
  ];
};

// Process social share data (placeholder, to be expanded with actual data)
export const processSocialShareData = (chartData: any[]) => {
  return [
    {
      name: "Platform 1 Shares",
      data: chartData.map(() => 0), // No data yet
      color: "#FF6384",
    },
  ];
};

// Time formatting
export const formatTime = (timestamp: number, timeUnit: TimeUnit) => {
  const date = new Date(timestamp * 1000);

  if (timeUnit === "hour") {
    return `${date.getHours().toString().padStart(2, "0")}:00`;
  } else if (timeUnit === "day") {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
  } else {
    const weekStart = new Date(date);
    const weekEnd = new Date(date);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${weekStart.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    })} - ${weekEnd.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    })}`;
  }
};
