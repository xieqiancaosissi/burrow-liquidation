import React, { useState, useEffect } from "react";
import ChartDisplay from "./ChartDisplay";
import { getDashBoardData } from "@/services/api";
import { BeatLoading } from "../Loading";
import PieChart from "./PieChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  data: number[] | number[][];
  epochIds: number[];
}

export default function StatisticTrendCharts() {
  const [data, setData] = useState<any>([]);
  const [EPOCHREVChartData, setEPOCHREVChartData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHPOINTS, setEPOCHPOINTS] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [adScaleData, setAdScaleData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });

  const [EPOCHMEMEData, setEPOCHMEMEData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHLAUNCHEDData, setEPOCHLAUNCHEDData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHHITData, setEPOCHHITData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHLIKINGUSERData, setEPOCHLIKINGUSERData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHPREBUYUSERData, setEPOCHPREBUYUSERData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHTRADINGData, setEPOCHTRADINGData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHTRADINGDEALData, setEPOCHTRADINGDEALData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHTRADINGVOLData, setEPOCHTRADINGVOLData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHBOUGHTData, setEPOCHBOUGHTData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHSOLDData, setEPOCHSOLDData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHPREBUYVOLData, setEPOCHPREBUYVOLData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHPREBUYORDERData, setEPOCHPREBUYORDERData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHPREBUYUSERFLIPData, setEPOCHPREBUYUSERFLIPData] =
    useState<ChartData>({ data: [], epochIds: [] });
  const [EPOCHLIKINGData, setEPOCHLIKINGData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHLIKEREWARDData, setEPOCHLIKEREWARDData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHAVGPOINTFORLIKINGData, setEPOCHAVGPOINTFORLIKINGData] =
    useState<ChartData>({ data: [], epochIds: [] });
  const [EPOCHIRData, setEPOCHIRData] = useState<ChartData>({
    data: [],
    epochIds: [],
  });
  const [EPOCHMINPOINTSUMFORLIKINGData, setEPOCHMINPOINTSUMFORLIKINGData] =
    useState<ChartData>({ data: [], epochIds: [] });
  const [EPOCHMINREWARDTOKENData, setEPOCHMINREWARDTOKENData] =
    useState<ChartData>({ data: [], epochIds: [] });
  const [PERIODCONTENTCREATORData, setPERIODCONTENTCREATORData] =
    useState<ChartData>({ data: [], epochIds: [] });
  const [PERIODCONTENTCREATORTOKENData, setPERIODCONTENTCREATORTOKENData] =
    useState<ChartData>({ data: [], epochIds: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const formatNumber = (value: any, isHover: boolean, type: string) => {
    const numericValue =
      typeof value === "number" && !isNaN(value)
        ? value
        : typeof value === "string" && !isNaN(Number(value))
        ? Number(value)
        : 0;

    if (isHover) {
      return type === "point"
        ? numericValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })
        : numericValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 9,
          });
    }
    return numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleMouseEnter = (item: string) => setHoveredItem(item);
  const handleMouseLeave = () => setHoveredItem(null);

  const EpochProgressBar = () => {
    const currentDate = new Date().getTime() / 1000;
    const epochCreateTime = data[0]?.epoch_create_time;
    const epochTime = data[0]?.epoch_time;
    const progressInEpoch =
      epochCreateTime && epochTime
        ? Math.floor(((currentDate - epochCreateTime) / epochTime) * 100)
        : 0;

    const displayProgress = progressInEpoch >= 100 ? 100 : progressInEpoch;

    return (
      <div className="mb-6">
        <div className="bg-gray-700 h-6 rounded-full overflow-hidden">
          <div
            className="bg-[#2050e9] h-full transition-all duration-500"
            style={{
              width: `${displayProgress}%`,
            }}
          >
            <span className="px-4 text-white text-xs">
              {displayProgress.toFixed(2)}% of current epoch
            </span>
          </div>
        </div>
      </div>
    );
  };

  const PeriodProgressBar = () => {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const currentDate = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;
    const periodLength = 7 * dayInMs; // 7 days in milliseconds

    const currentPeriod = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / periodLength
    );
    const totalPeriodsInYear = Math.floor(365 / 7);

    const currentPeriodStartDate = new Date(
      startDate.getTime() + currentPeriod * periodLength
    );
    const progressInCurrentPeriod =
      ((currentDate.getTime() - currentPeriodStartDate.getTime()) /
        periodLength) *
      100;

    return (
      <div className="mb-6">
        <div className="flex gap-12 mb-4">
          <div className="text-sm text-gray-300">
            current period:
            <span className="text-white ml-1">{currentPeriod}</span>
          </div>
          <div className="text-sm text-gray-300">
            finalized period:
            <span className="text-white ml-1">{data[0]?.epoch_id || "-"}</span>
          </div>
          <div className="text-sm text-gray-300">
            period last:
            <span className="text-white ml-1">7 days</span>
          </div>
        </div>
        <div className="bg-gray-700 h-6 rounded-full overflow-hidden">
          <div
            className="bg-[#2050e9] h-full transition-all duration-500"
            style={{ width: `${progressInCurrentPeriod}%` }}
          >
            <span className="px-4 text-white text-xs">
              {Math.floor(progressInCurrentPeriod)}% of current period
            </span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashBoardData();
      if (res?.data?.data) {
        setData(res.data.data);
        const epochIds = res.data.data.map((item: any) => item.epoch_id);
        setEPOCHREVChartData({
          data: res.data.data.map((item: any) => {
            const revenue = parseFloat(item.epoch_revenue);
            return isNaN(revenue) ? 0 : revenue.toFixed(9);
          }),
          epochIds: epochIds,
        });

        setEPOCHPOINTS({
          data: [
            res.data.data.map((item: any) => {
              const value = parseFloat(item.epoch_reward);
              return isNaN(value) ? "0" : value.toFixed(6);
            }),
            res.data.data.map((item: any) => {
              const value = parseFloat(item.epoch_reward_value);
              return isNaN(value) ? "0" : value.toFixed(9);
            }),
          ],
          epochIds: epochIds,
        });

        setAdScaleData({
          data: res.data.data.map((item: any) => {
            const likeReward = parseFloat(item.epoch_like_reward) || 0;
            const epochRevenue = parseFloat(item.epoch_revenue) || 0;
            const tokenPrice = parseFloat(item.token_price) || 0;

            if (
              !likeReward ||
              !epochRevenue ||
              !tokenPrice ||
              isNaN(likeReward) ||
              isNaN(epochRevenue) ||
              isNaN(tokenPrice)
            ) {
              return 0;
            }

            return likeReward / (epochRevenue / tokenPrice);
          }),
          epochIds: epochIds,
        });

        // MEME tokens section
        setEPOCHMEMEData({
          data: res.data.data.map((item: any) => item.epoch_meme_created_count),
          epochIds: epochIds,
        });

        setEPOCHLAUNCHEDData({
          data: res.data.data.map(
            (item: any) => item.epoch_meme_launching_count
          ),
          epochIds: epochIds,
        });

        setEPOCHHITData({
          data: res.data.data.map(
            (item: any) => item.epoch_meme_launched_count
          ),
          epochIds: epochIds,
        });

        // Users Info section
        setEPOCHLIKINGUSERData({
          data: res.data.data.map((item: any) => item.epoch_like_user_count),
          epochIds: epochIds,
        });

        setEPOCHPREBUYUSERData({
          data: res.data.data.map((item: any) => item.epoch_flip_user_count),
          epochIds: epochIds,
        });

        setEPOCHTRADINGData({
          data: res.data.data.map((item: any) => item.epoch_trade_user_count),
          epochIds: epochIds,
        });

        // Trading Info section
        setEPOCHTRADINGDEALData({
          data: res.data.data.map((item: any) => item.epoch_trade_count),
          epochIds: epochIds,
        });

        setEPOCHTRADINGVOLData({
          data: res.data.data.map((item: any) => {
            const value = parseFloat(item.epoch_trade_amount);
            return isNaN(value) ? 0 : value.toFixed(9);
          }),
          epochIds: epochIds,
        });

        setEPOCHBOUGHTData({
          data: res.data.data.map((item: any) => item.epoch_trade_buy_amount),
          epochIds: epochIds,
        });

        setEPOCHSOLDData({
          data: res.data.data.map((item: any) => item.epoch_trade_sell_amount),
          epochIds: epochIds,
        });

        // PreBuy Info section
        setEPOCHPREBUYVOLData({
          data: res.data.data.map((item: any) => {
            const value = parseFloat(item.epoch_flip_amount);
            return isNaN(value) ? 0 : value.toFixed(9);
          }),
          epochIds: epochIds,
        });

        setEPOCHPREBUYORDERData({
          data: res.data.data.map((item: any) => item.epoch_flip_count),
          epochIds: epochIds,
        });

        setEPOCHPREBUYUSERFLIPData({
          data: res.data.data.map((item: any) => item.epoch_flip_user_count),
          epochIds: epochIds,
        });

        // Like Info section
        setEPOCHLIKINGData({
          data: res.data.data.map((item: any) => item.epoch_like_count),
          epochIds: epochIds,
        });

        setEPOCHLIKEREWARDData({
          data: [
            res.data.data.map((item: any) => item.epoch_like_reward),
            res.data.data.map((item: any) => item.epoch_like_reward_value),
          ],
          epochIds: epochIds,
        });

        setEPOCHAVGPOINTFORLIKINGData({
          data: res.data.data.map((item: any) => {
            const likeReward = parseFloat(item.epoch_like_reward) || 0;
            const likeUserCount = parseFloat(item.epoch_like_user_count) || 1;
            return likeReward / likeUserCount;
          }),
          epochIds: epochIds,
        });

        setEPOCHIRData({
          data: res.data.data.map((item: any) => item.last_ir),
          epochIds: epochIds,
        });

        setEPOCHMINPOINTSUMFORLIKINGData({
          data: res.data.data.map((item: any) => item.epoch_like_min_reward),
          epochIds: epochIds,
        });

        setEPOCHMINREWARDTOKENData({
          data: res.data.data.map(
            (item: any) => item.epoch_min_reward_like_count
          ),
          epochIds: epochIds,
        });
      }
      setLoading(false);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);
  const curEpoch = data[0]
    ? Math.ceil(
        (new Date().getTime() / 1000 - data[0]?.epoch_create_time) /
          data[0]?.epoch_time
      ) + data[0]?.epoch_id
    : "";
  return (
    <div className="text-white">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoading />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              Epoch Progress
            </h3>
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                cur epoch:
                <span className="text-white ml-1">{curEpoch}</span>
              </div>
              <div className="text-sm text-gray-300">
                finalized epoch:
                <span className="text-white ml-1">{data[0]?.epoch_id}</span>
              </div>
              <div className="text-sm text-gray-300">
                epoch last:
                <span className="text-white ml-1">{data[0]?.epoch_time}</span>
              </div>
            </div>
            <EpochProgressBar />
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              Revenue and Incentives
            </h3>
            <div className="flex gap-12 mb-4">
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("ACC_REV")}
                onMouseLeave={handleMouseLeave}
              >
                ACC REV:
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_revenue,
                    hoveredItem === "ACC_REV",
                    "revenue"
                  )}
                </span>
              </div>
              <div
                className="text-sm text-gray-300 cursor-pointer relative"
                onMouseEnter={() => handleMouseEnter("ACC_TOKEN")}
                onMouseLeave={handleMouseLeave}
              >
                ACC TOKEN:
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_reward,
                    hoveredItem === "ACC_TOKEN",
                    "point"
                  )}
                </span>
                {hoveredItem === "ACC_TOKEN" && (
                  <div className="absolute z-10 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {formatNumber(
                      data[0]?.total_reward * data[0]?.token_price,
                      true,
                      "value"
                    )}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-300">
                TOKEN PRICE:
                <span className="text-white ml-1">{data[0]?.token_price}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[300px]">
                <PieChart
                  data={[
                    parseFloat(data[0]?.total_revenue || "0").toFixed(6),
                    parseFloat(
                      String(data[0]?.total_reward * data[0]?.token_price || 0)
                    ).toFixed(6),
                  ].map(Number)}
                  labels={["ACC REV", "ACC TOKEN"]}
                  colors={[
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 205, 86, 0.8)",
                  ]}
                />
              </div>
              <div className="h-[300px]">
                <PieChart
                  data={[
                    parseFloat(data[0]?.total_trade_reward || "0"),
                    parseFloat(data[0]?.total_launched_creator_reward || "0"),
                    parseFloat(data[0]?.total_launched_reward || "0") -
                      parseFloat(data[0]?.total_launched_creator_reward || "0"),
                    parseFloat(data[0]?.total_like_reward || "0"),
                  ].map(Number)}
                  labels={[
                    "Trade Reward",
                    "Creator Reward",
                    "Preliker Reward",
                    "Like Reward",
                  ]}
                  colors={[
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 205, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(255, 99, 132, 0.8)",
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: EPOCHREVChartData.data,
                  epochIds: EPOCHREVChartData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH REV"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPOINTS.data,
                  epochIds: EPOCHPOINTS.epochIds,
                }}
                colors={["#FFCE56", "#36A2EB"]}
                title="EPOCH TOKEN"
              />
              <ChartDisplay
                data={{
                  data: adScaleData.data,
                  epochIds: adScaleData.epochIds,
                }}
                colors={["rgba(54, 162, 235, 0.8)"]}
                title="LIKING TOKEN RATIO"
                chartType="line"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              MEME tokens
            </h3>
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                TOTAL MEME:{" "}
                <span className="text-white ml-1">
                  {data[0]?.total_meme_created_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL LAUNCHING:{" "}
                <span className="text-white ml-1">
                  {data[0]?.total_meme_launching_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL LAUNCHED:{" "}
                <span className="text-white ml-1">
                  {data[0]?.total_meme_launched_count}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: EPOCHMEMEData.data,
                  epochIds: EPOCHMEMEData.epochIds,
                }}
                colors={["#FF9F40"]}
                title="EPOCH MEME"
              />
              <ChartDisplay
                data={{
                  data: EPOCHLAUNCHEDData.data,
                  epochIds: EPOCHLAUNCHEDData.epochIds,
                }}
                colors={["#9966FF"]}
                title="EPOCH LAUNCHING"
              />
              <ChartDisplay
                data={{
                  data: EPOCHHITData.data,
                  epochIds: EPOCHHITData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH LAUNCHED"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">Users Info</h3>
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                TOTAL USERS
                <span className="text-white ml-1">
                  {data[0]?.total_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL TRADING USERS
                <span className="text-white ml-1">
                  {data[0]?.total_trade_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL PREBUY USERS
                <span className="text-white ml-1">
                  {data[0]?.total_flip_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL LIKING USERS
                <span className="text-white ml-1">
                  {data[0]?.total_like_user_count}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: EPOCHLIKINGUSERData.data,
                  epochIds: EPOCHLIKINGUSERData.epochIds,
                }}
                colors={["#36A2EB"]}
                title="EPOCH LIKING USERS"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYUSERData.data,
                  epochIds: EPOCHPREBUYUSERData.epochIds,
                }}
                colors={["#4BC0C0"]}
                title="EPOCH PREBUY USERS"
              />
              <ChartDisplay
                data={{
                  data: EPOCHTRADINGData.data,
                  epochIds: EPOCHTRADINGData.epochIds,
                }}
                colors={["#FF9F40"]}
                title="EPOCH TRADING USERS"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              Trading Info
            </h3>
            <div className="flex gap-12 mb-4">
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("TOTAL_TRADING_VOL")}
                onMouseLeave={handleMouseLeave}
              >
                ACC TRADING VOL
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_trade_amount,
                    hoveredItem === "TOTAL_TRADING_VOL",
                    "volume"
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL TRADING DEALS
                <span className="text-white ml-1">
                  {data[0]?.total_trade_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL TRADING USERS
                <span className="text-white ml-1">
                  {data[0]?.total_trade_user_count}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: EPOCHTRADINGDEALData.data,
                  epochIds: EPOCHTRADINGDEALData.epochIds,
                }}
                colors={["#9966FF"]}
                title="EPOCH TRADING DEALS"
              />
              <ChartDisplay
                data={{
                  data: EPOCHTRADINGVOLData.data,
                  epochIds: EPOCHTRADINGVOLData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH TRADING VOL"
              />
              <ChartDisplay
                data={{
                  data: EPOCHBOUGHTData.data,
                  epochIds: EPOCHBOUGHTData.epochIds,
                }}
                colors={["#36A2EB"]}
                title="EPOCH BUYING VOL"
              />
              <ChartDisplay
                data={{
                  data: EPOCHSOLDData.data,
                  epochIds: EPOCHSOLDData.epochIds,
                }}
                colors={["#4BC0C0"]}
                title="EPOCH SELLING VOL"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              PreBuy(flip) Info
            </h3>
            <div className="flex gap-12 mb-4">
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("TOTAL_PREBUY_VOL")}
                onMouseLeave={handleMouseLeave}
              >
                ACC PREBUY VOL
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_flip_amount,
                    hoveredItem === "TOTAL_PREBUY_VOL",
                    "volume"
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL PREBUY DEALS
                <span className="text-white ml-1">
                  {data[0]?.total_flip_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL PREBUY USERS
                <span className="text-white ml-1">
                  {data[0]?.total_flip_user_count}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYVOLData.data,
                  epochIds: EPOCHPREBUYVOLData.epochIds,
                }}
                colors={["#FF9F40"]}
                title="EPOCH PREBUY VOL"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYORDERData.data,
                  epochIds: EPOCHPREBUYORDERData.epochIds,
                }}
                colors={["#9966FF"]}
                title="EPOCH PREBUY ORDERS"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYUSERFLIPData.data,
                  epochIds: EPOCHPREBUYUSERFLIPData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH PREBUY USERS"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">like info</h3>
            <div className="flex gap-12 mb-4">
              <div
                className="text-sm text-gray-300 cursor-pointer relative"
                onMouseEnter={() => handleMouseEnter("TOTAL_POINT_FOR_LIKING")}
                onMouseLeave={handleMouseLeave}
              >
                TOTAL LIKING TOKEN
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_like_reward,
                    hoveredItem === "TOTAL_POINT_FOR_LIKING",
                    "point"
                  )}
                </span>
                {hoveredItem === "TOTAL_POINT_FOR_LIKING" && (
                  <div className="absolute z-10 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {formatNumber(
                      data[0]?.total_like_reward_value,
                      true,
                      "value"
                    )}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-300">
                TOTAL LIKING USER
                <span className="text-white ml-1">
                  {data[0]?.total_like_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL LIKING
                <span className="text-white ml-1">
                  {data[0]?.total_like_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                INVALID LIKING
                <span className="text-white ml-1">
                  {data[0]?.total_invalid_like_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                MIN REWARD LIKING
                <span className="text-white ml-1">
                  {" "}
                  {data[0]?.total_min_reward_like_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                MIN REWARD LIKING TOKEN
                <span className="text-white ml-1">
                  {data[0]?.total_like_min_reward}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: EPOCHLIKINGUSERData.data,
                  epochIds: EPOCHLIKINGUSERData.epochIds,
                }}
                colors={["#36A2EB"]}
                title="EPOCH LIKING USER"
              />
              <ChartDisplay
                data={{
                  data: EPOCHLIKINGData.data,
                  epochIds: EPOCHLIKINGData.epochIds,
                }}
                colors={["#4BC0C0"]}
                title="EPOCH LIKING"
              />
              <ChartDisplay
                data={{
                  data: EPOCHLIKEREWARDData.data,
                  epochIds: EPOCHLIKEREWARDData.epochIds,
                }}
                colors={["#FF9F40", "#9966FF"]}
                title="EPOCH LIKING TOKEN"
              />
              {/* <ChartDisplay
                data={{
                  data: EPOCHAVGPOINTFORLIKINGData.data,
                  epochIds: EPOCHAVGPOINTFORLIKINGData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH_AVG_POINT_FOR_LIKING"
              /> */}
              <ChartDisplay
                data={{
                  data: EPOCHMINREWARDTOKENData.data,
                  epochIds: EPOCHMINREWARDTOKENData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH MIN REWARD LIKING"
              />
              <ChartDisplay
                data={{
                  data: EPOCHMINPOINTSUMFORLIKINGData.data,
                  epochIds: EPOCHMINPOINTSUMFORLIKINGData.epochIds,
                }}
                colors={["#00FFD1"]}
                title="EPOCH MIN REWARD TOKEN"
              />
              <ChartDisplay
                data={{
                  data: EPOCHIRData.data,
                  epochIds: EPOCHIRData.epochIds,
                }}
                colors={["#36A2EB"]}
                title="EPOCH IR"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              social sharing
            </h3>
            <PeriodProgressBar />
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                TOTAL CONTENT CREATOR
                <span className="text-white ml-1">-</span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL CONTENT CREATOR TOKEN
                <span className="text-white ml-1">-</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={{
                  data: PERIODCONTENTCREATORData.data,
                  epochIds: PERIODCONTENTCREATORData.epochIds,
                }}
                colors={["#FF9F40"]}
                title="PERIOD CONTENT CREATOR"
              />
              <ChartDisplay
                data={{
                  data: PERIODCONTENTCREATORTOKENData.data,
                  epochIds: PERIODCONTENTCREATORTOKENData.epochIds,
                }}
                colors={["#9966FF"]}
                title="PERIOD CONTENT CREATOR TOKEN"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
