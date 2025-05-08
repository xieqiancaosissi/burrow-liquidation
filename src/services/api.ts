import { ILiquidation, ILiquidationResponse } from "../interface/common";
import getConfig from "./config";
const config = getConfig();
const { DASH_BOARD_API_URL } = config;

export const getTxId = async (receipt_id: string) => {
  return await fetch(
    `https://api3.nearblocks.io/v1/search/?keyword=${receipt_id}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getPerice = async () => {
  return await fetch(`https://api.ref.finance/list-token-price`)
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getDashBoardData = async (
  pageSize: number = 30,
  pageCount: number = 1
) => {
  return await fetch(
    `${DASH_BOARD_API_URL}/api/v1/mining/dashboard/infos?page_count=${pageCount}&page_size=${pageSize}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getSocialDashBoardData = async () => {
  return await fetch(`${DASH_BOARD_API_URL}/api/v1/mining/socialdashboard/info`)
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getBotDashBoardData = async (
  endTime: string,
  startTime: string
) => {
  return await fetch(
    `${DASH_BOARD_API_URL}/api/v1/trade/volume/count?end_time=${endTime}&from_time=${startTime}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};
