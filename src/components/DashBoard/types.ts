export type TimeUnit = "hour" | "day" | "week";

export interface DataItem {
  epoch_create_time: number;
  epoch_revenue: string;
  epoch_reward_value: string;
  epoch_id: number;
  epoch_trade_reward: string;
  epoch_launched_creator_reward: string;
  epoch_launched_reward: string;
  epoch_like_reward: string;
  epoch_meme_created_count: string;
  epoch_meme_launched_count: string;
  epoch_meme_launching_count: string;
  total_user_count: string;
  epoch_like_user_count: string;
  epoch_flip_user_count: string;
  epoch_trade_user_count: string;
  epoch_trade_count: string;
  epoch_trade_amount: string;
  epoch_like_count: string;
  epoch_trade_flip_reward: string;
  epoch_trade_pump_reward: string;
}

export interface ChartData {
  time: number;
  revenue: number;
  tokenValue: number;
  timestamp?: number;
  tradeReward?: number;
  creatorReward?: number;
  launchedReward?: number;
  likeReward?: number;
  memeCreated: number;
  memeLaunched: number;
  memeLaunching: number;
  totalUsers: number;
  likeUsers: number;
  flipUsers: number;
  tradeUsers: number;
  tradeCount: number;
  tradeAmount: number;
  likeCount: number;
  tradeFlipReward: number;
  tradePumpReward: number;
}
