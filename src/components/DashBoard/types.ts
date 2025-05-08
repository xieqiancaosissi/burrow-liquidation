export type TimeUnit = "hour" | "day" | "week";

export interface DataPoint {
  time: number;
  value: number;
}

export interface DataItem {
  epoch_create_time: number;
  epoch_revenue: string;
  epoch_reward_value: string;
  epoch_trade_reward: string;
  epoch_launched_creator_reward: string;
  epoch_launched_reward: string;
  epoch_like_reward: string;
  epoch_meme_created_count: string;
  epoch_meme_launched_count: string;
  epoch_meme_launching_count: string;
  epoch_user_count: string;
  epoch_like_user_count: string;
  epoch_flip_user_count: string;
  epoch_trade_user_count: string;
  epoch_trade_count: string;
  epoch_trade_amount: string;
  epoch_like_count: string;
  epoch_trade_flip_reward: string;
  epoch_trade_pump_reward: string;
  epoch_raydium_revenue: string;
  epoch_meteora_revenue: string;
  epoch_flip_amount: string;
  epoch_flip_count: string;
  epoch_raydium_trade_buy_amount: string;
  epoch_raydium_trade_buy_count: string;
  epoch_raydium_trade_sell_amount: string;
  epoch_raydium_trade_sell_count: string;
  epoch_meteora_trade_buy_amount: string;
  epoch_meteora_trade_buy_count: string;
  epoch_meteora_trade_sell_amount: string;
  epoch_meteora_trade_sell_count: string;
  epoch_pump_trade_buy_amount: string;
  epoch_pump_trade_buy_count: string;
  epoch_pump_trade_sell_amount: string;
  epoch_pump_trade_sell_count: string;
  epoch_trade_raydium_reward: string;
  epoch_trade_meteora_reward: string;
  epoch_meme_raydium_launched_count: string;
  epoch_meme_meteora_launched_count: string;
  epoch_launched_raydium_creator_reward: string;
  epoch_launched_meteora_creator_reward: string;
  [key: string]: any;
}

export interface ChartData {
  time: number;
  revenue: number;
  tokenValue: number;
  tradeReward: number;
  creatorReward: number;
  launchedReward: number;
  likeReward: number;
  count: number;
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
  [key: string]: any;
}

export interface SeriesData {
  name: string;
  data: number[];
  color: string;
}
