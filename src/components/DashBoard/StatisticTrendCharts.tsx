import React, { useState, useEffect } from "react";
import ChartDisplay from "./ChartDisplay";
import { getDashBoardData } from "@/services/api";
import { BeatLoading } from "../Loading";
import PieChart from "./PieChart";

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
              const value = parseFloat(
                item.epoch_reward_value
              );
              return isNaN(value) ? "0" : value.toFixed(9);
            }),
          ],
          epochIds: epochIds,
        });

        setAdScaleData({
          data: [
            res.data.data.map((item: any) => {
              const epochRevenue = parseFloat(item.epoch_revenue);
              return epochRevenue === 0
                ? 0
                : (item.epoch_trade_reward / epochRevenue) * 100;
            }),
            res.data.data.map((item: any) => {
              const epochRevenue = parseFloat(item.epoch_revenue);
              return epochRevenue === 0
                ? 0
                : (item.epoch_like_reward / epochRevenue) * 100;
            }),
          ],
          epochIds: epochIds,
        });

        // MEME tokens section
        setEPOCHMEMEData({
          data: res.data.data.map((item: any) => item.epoch_meme_created_count),
          epochIds: epochIds,
        });

        setEPOCHLAUNCHEDData({
          data: res.data.data.map(
            (item: any) => item.epoch_meme_launched_count
          ),
          epochIds: epochIds,
        });

        setEPOCHHITData({
          data: res.data.data.map((item: any) => item.epoch_flip_count),
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
      }
      setLoading(false);
    };
    fetchData();
  }, []);
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
              Revenue and Incentives
            </h3>
            <div className="flex gap-12 mb-4">
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("ACC_REV")}
                onMouseLeave={handleMouseLeave}
              >
                ACC_REV:
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_revenue,
                    hoveredItem === "ACC_REV",
                    "revenue"
                  )}
                </span>
              </div>
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("ACC_POINT")}
                onMouseLeave={handleMouseLeave}
              >
                ACC_POINT:
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_reward,
                    hoveredItem === "ACC_POINT",
                    "point"
                  )}
                </span>
              </div>
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("ACC_POINT_VAL")}
                onMouseLeave={handleMouseLeave}
              >
                ACC_POINT_VAL:
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_reward * data[0]?.token_price,
                    hoveredItem === "ACC_POINT_VAL",
                    "value"
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                PRICE:
                <span className="text-white ml-1">
                  {data[0]?.token_price}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[300px]">
                <PieChart
                  data={[
                    parseFloat(data[0]?.total_revenue || "0"),
                    parseFloat(
                      String(
                        data[0]?.total_reward * data[0]?.token_price || 0
                      )
                    ),
                  ].map(Number)}
                  labels={["ACC_REV", "ACC_POINT_VAL"]}
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
                    parseFloat(data[0]?.total_launched_reward || "0"),
                    parseFloat(data[0]?.total_like_reward || "0"),
                  ].map(Number)}
                  labels={[
                    "Trade Reward",
                    "Creator Reward",
                    "Launch Reward",
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
                title="EPOCH_REV"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPOINTS.data,
                  epochIds: EPOCHPOINTS.epochIds,
                }}
                colors={["#FFCE56", "#36A2EB"]}
                title="EPOCH_POINTS"
              />
              <ChartDisplay
                data={{
                  data: adScaleData.data,
                  epochIds: adScaleData.epochIds,
                }}
                colors={["rgba(54, 162, 235, 0.8)", "#FF6384"]}
                title="AD_SCALE"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">
              MEME tokens
            </h3>
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                TOTAL_MEME:{" "}
                <span className="text-white ml-1">
                  {data[0]?.total_meme_created_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_LAUNCHED:{" "}
                <span className="text-white ml-1">
                  {data[0]?.total_meme_launched_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_HIT:{" "}
                <span className="text-white ml-1">
                  {data[0]?.total_flip_count}
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
                title="EPOCH_MEME"
              />
              <ChartDisplay
                data={{
                  data: EPOCHLAUNCHEDData.data,
                  epochIds: EPOCHLAUNCHEDData.epochIds,
                }}
                colors={["#9966FF"]}
                title="EPOCH_LAUNCHED"
              />
              <ChartDisplay
                data={{
                  data: EPOCHHITData.data,
                  epochIds: EPOCHHITData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH_HIT"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">Users Info</h3>
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                TOTAL_USER
                <span className="text-white ml-1">
                  {data[0]?.total_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_TRADING_USER
                <span className="text-white ml-1">
                  {data[0]?.total_trade_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_PREBUY_USER
                <span className="text-white ml-1">
                  {data[0]?.total_flip_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_LIKING_USER
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
                title="EPOCH_LIKING_USER"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYUSERData.data,
                  epochIds: EPOCHPREBUYUSERData.epochIds,
                }}
                colors={["#4BC0C0"]}
                title="EPOCH_PREBUY_USER"
              />
              <ChartDisplay
                data={{
                  data: EPOCHTRADINGData.data,
                  epochIds: EPOCHTRADINGData.epochIds,
                }}
                colors={["#FF9F40"]}
                title="EPOCH_TRADING_USER"
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
                TOTAL_TRADING_VOL
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_trade_amount,
                    hoveredItem === "TOTAL_TRADING_VOL",
                    "volume"
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_TRADING_DEAL
                <span className="text-white ml-1">
                  {data[0]?.total_trade_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_TRADING_USER
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
                title="EPOCH_TRADING_DEAL"
              />
              <ChartDisplay
                data={{
                  data: EPOCHTRADINGVOLData.data,
                  epochIds: EPOCHTRADINGVOLData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH_TRADING_VOL"
              />
              <ChartDisplay
                data={{
                  data: EPOCHBOUGHTData.data,
                  epochIds: EPOCHBOUGHTData.epochIds,
                }}
                colors={["#36A2EB"]}
                title="EPOCH_BOUGHT"
              />
              <ChartDisplay
                data={{
                  data: EPOCHSOLDData.data,
                  epochIds: EPOCHSOLDData.epochIds,
                }}
                colors={["#4BC0C0"]}
                title="EPOCH_SOLD"
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
                TOTAL_PREBUY_VOL
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_flip_amount,
                    hoveredItem === "TOTAL_PREBUY_VOL",
                    "volume"
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_PREBUY_ORDER
                <span className="text-white ml-1">
                  {data[0]?.total_flip_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_PREBUY_USER
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
                title="EPOCH_PREBUY_VOL"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYORDERData.data,
                  epochIds: EPOCHPREBUYORDERData.epochIds,
                }}
                colors={["#9966FF"]}
                title="EPOCH_PREBUY_ORDER"
              />
              <ChartDisplay
                data={{
                  data: EPOCHPREBUYUSERFLIPData.data,
                  epochIds: EPOCHPREBUYUSERFLIPData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH_PREBUY_USER"
              />
            </div>
          </div>
          <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-300">like info</h3>
            <div className="flex gap-12 mb-4">
              <div className="text-sm text-gray-300">
                TOTAL_POINT_FOR_LIKING
                <span className="text-white ml-1">
                  {data[0]?.total_like_count}
                </span>
              </div>
              <div
                className="text-sm text-gray-300 cursor-pointer"
                onMouseEnter={() =>
                  handleMouseEnter("TOTAL_POINT_VAL_FOR_LIKING")
                }
                onMouseLeave={handleMouseLeave}
              >
                TOTAL_POINT_VAL_FOR_LIKING
                <span className="text-white ml-1">
                  {formatNumber(
                    data[0]?.total_like_reward,
                    hoveredItem === "TOTAL_POINT_VAL_FOR_LIKING",
                    "value"
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_LIKING_USER
                <span className="text-white ml-1">
                  {data[0]?.total_like_user_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_LIKING
                <span className="text-white ml-1">
                  {data[0]?.total_like_count}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                TOTAL_INVALID_LIKING
                <span className="text-white ml-1">
                  {data[0]?.total_invalid_like_count}
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
                title="EPOCH_LIKING_USER"
              />
              <ChartDisplay
                data={{
                  data: EPOCHLIKINGData.data,
                  epochIds: EPOCHLIKINGData.epochIds,
                }}
                colors={["#4BC0C0"]}
                title="EPOCH_LIKING"
              />
              <ChartDisplay
                data={{
                  data: EPOCHLIKEREWARDData.data,
                  epochIds: EPOCHLIKEREWARDData.epochIds,
                }}
                colors={["#FF9F40", "#9966FF"]}
                title="EPOCH_POINT_FOR_LIKING"
              />
              <ChartDisplay
                data={{
                  data: EPOCHAVGPOINTFORLIKINGData.data,
                  epochIds: EPOCHAVGPOINTFORLIKINGData.epochIds,
                }}
                colors={["#FF6384"]}
                title="EPOCH_AVG_POINT_FOR_LIKING"
              />
              <ChartDisplay
                data={{
                  data: EPOCHIRData.data,
                  epochIds: EPOCHIRData.epochIds,
                }}
                colors={["#36A2EB"]}
                title="EPOCH_IR"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
