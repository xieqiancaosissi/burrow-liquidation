import React, { useState, useEffect } from "react";
import ChartDisplay from "./ChartDisplay";
import { getDashBoardData } from "@/services/api";
import { BeatLoading } from "../Loading";

export default function StatisticTrendCharts() {
  const [data, setData] = useState<any>([]);
  const [EPOCHREVChartData, setEPOCHREVChartData] = useState<any>([]);
  const [EPOCH_POINTS, setEPOCH_POINTS] = useState<any[]>([]);
  const [adScaleData, setAdScaleData] = useState<any[]>([]);
  const [EPOCHMEMEData, setEPOCHMEMEData] = useState<any[]>([]);
  const [EPOCHLAUNCHEDData, setEPOCHLAUNCHEDData] = useState<any[]>([]);
  const [EPOCHHITData, setEPOCHHITData] = useState<any[]>([]);
  const [EPOCHLIKINGUSERData, setEPOCHLIKINGUSERData] = useState<any[]>([]);
  const [EPOCHPREBUYUSERData, setEPOCHPREBUYUSERData] = useState<any[]>([]);
  const [EPOCHTRADINGData, setEPOCHTRADINGData] = useState<any[]>([]);
  const [EPOCHTRADINGDEALData, setEPOCHTRADINGDEALData] = useState<any[]>([]);
  const [EPOCHTRADINGVOLData, setEPOCHTRADINGVOLData] = useState<any[]>([]);
  const [EPOCHBOUGHTData, setEPOCHBOUGHTData] = useState<any[]>([]);
  const [EPOCHSOLDData, setEPOCHSOLDData] = useState<any[]>([]);
  const [EPOCHPREBUYVOLData, setEPOCHPREBUYVOLData] = useState<any[]>([]);
  const [EPOCHPREBUYORDERData, setEPOCHPREBUYORDERData] = useState<any[]>([]);
  const [EPOCHPREBUYUSERFLIPData, setEPOCHPREBUYUSERFLIPData] = useState<any[]>(
    []
  );
  const [EPOCHLIKINGData, setEPOCHLIKINGData] = useState<any[]>([]);
  const [EPOCHLIKEREWARDData, setEPOCHLIKEREWARDData] = useState<any[]>([]);
  const [EPOCHLIKEREWARDVALUEData, setEPOCHLIKEREWARDVALUEData] = useState<
    any[]
  >([]);
  const [EPOCHAVGPOINTFORLIKINGData, setEPOCHAVGPOINTFORLIKINGData] = useState<
    any[]
  >([]);
  const [EPOCHIRData, setEPOCHIRData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashBoardData();
      if (res?.data?.data) {
        setData(res.data.data);
        setEPOCHREVChartData(
          res.data.data.map((item: any) => item.epoch_revenue)
        );

        const epochPointsData = res.data.data.map((item: any) => ({
          value: item.epoch_launched_creator_reward_value,
          points: item.epoch_launched_creator_reward,
        }));
        setEPOCH_POINTS(epochPointsData);

        const adScaleData = res.data.data.map((item: any) => {
          const tradeReward = parseFloat(item.epoch_trade_reward) || 0;
          const likeReward = parseFloat(item.epoch_like_reward) || 0;
          return likeReward > 0 ? tradeReward / likeReward : 0;
        });
        setAdScaleData(adScaleData);

        setEPOCHMEMEData(
          res.data.data.map((item: any) => item.epoch_meme_created_count)
        );
        setEPOCHLAUNCHEDData(
          res.data.data.map((item: any) => item.epoch_meme_launched_count)
        );
        setEPOCHHITData(
          res.data.data.map((item: any) => item.epoch_flip_count)
        );
        setEPOCHLIKINGUSERData(
          res.data.data.map((item: any) => item.epoch_like_user_count)
        );
        setEPOCHPREBUYUSERData(
          res.data.data.map((item: any) => item.epoch_flip_user_count)
        );
        setEPOCHTRADINGData(
          res.data.data.map((item: any) => item.epoch_trade_user_count)
        );
        setEPOCHTRADINGDEALData(
          res.data.data.map((item: any) => item.epoch_trade_count)
        );
        setEPOCHTRADINGVOLData(
          res.data.data.map((item: any) => item.epoch_trade_amount)
        );
        setEPOCHBOUGHTData(
          res.data.data.map((item: any) => item.epoch_trade_buy_amount)
        );
        setEPOCHSOLDData(
          res.data.data.map((item: any) => item.epoch_trade_sell_amount)
        );
        setEPOCHPREBUYVOLData(
          res.data.data.map((item: any) => item.epoch_flip_amount)
        );
        setEPOCHPREBUYORDERData(
          res.data.data.map((item: any) => item.epoch_flip_count)
        );
        setEPOCHPREBUYUSERFLIPData(
          res.data.data.map((item: any) => item.epoch_flip_user_count)
        );
        setEPOCHLIKINGData(
          res.data.data.map((item: any) => item.epoch_like_count)
        );
        setEPOCHLIKEREWARDData(
          res.data.data.map((item: any) => item.epoch_like_reward)
        );
        setEPOCHLIKEREWARDVALUEData(
          res.data.data.map((item: any) => item.epoch_like_reward_value)
        );
        const avgPointsForLiking = res.data.data.map((item: any) => {
          const likeReward = parseFloat(item.epoch_like_reward) || 0;
          const likeUserCount = parseFloat(item.epoch_like_user_count) || 1;
          return likeReward / likeUserCount;
        });
        setEPOCHAVGPOINTFORLIKINGData(avgPointsForLiking);
        setEPOCHIRData(res.data.data.map((item: any) => item.last_ir));
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
              <div className="text-sm text-gray-300">
                ACC_REV:
                <span className="text-white ml-1">
                  {data[0]?.total_revenue}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                ACC_POINT:
                <span className="text-white ml-1">
                  {data[0]?.total_launched_creator_reward}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                ACC_POINT_VAL:
                <span className="text-white ml-1">
                  {data[0]?.total_launched_creator_reward_value}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                PRICE:
                <span className="text-white ml-1">
                  {data[0]?.hit_bonding_curve_token_price}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <ChartDisplay
                data={EPOCHREVChartData}
                colors={["#FF6384"]}
                title="EPOCH_REV"
              />
              <ChartDisplay
                data={[
                  EPOCH_POINTS.map((point) => point.value),
                  EPOCH_POINTS.map((point) => point.points),
                ]}
                colors={["#36A2EB", "#FFCE56"]}
                title="EPOCH_POINTS"
                yAxes={[{ position: "left" }, { position: "right" }]}
              />
              <ChartDisplay
                data={adScaleData}
                colors={["#4BC0C0"]}
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
                data={EPOCHMEMEData}
                colors={["#FF9F40"]}
                title="EPOCH_MEME"
              />
              <ChartDisplay
                data={EPOCHLAUNCHEDData}
                colors={["#9966FF"]}
                title="EPOCH_LAUNCHED"
              />
              <ChartDisplay
                data={EPOCHHITData}
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
                data={EPOCHLIKINGUSERData}
                colors={["#36A2EB"]}
                title="EPOCH_LIKING_USER"
              />
              <ChartDisplay
                data={EPOCHPREBUYUSERData}
                colors={["#4BC0C0"]}
                title="EPOCH_PREBUY_USER"
              />
              <ChartDisplay
                data={EPOCHTRADINGData}
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
              <div className="text-sm text-gray-300">
                TOTAL_TRADING_VOL
                <span className="text-white ml-1">
                  {data[0]?.total_trade_amount}
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
                data={EPOCHTRADINGDEALData}
                colors={["#9966FF"]}
                title="EPOCH_TRADING_DEAL"
              />
              <ChartDisplay
                data={EPOCHTRADINGVOLData}
                colors={["#FF6384"]}
                title="EPOCH_TRADING_VOL"
              />
              <ChartDisplay
                data={EPOCHBOUGHTData}
                colors={["#36A2EB"]}
                title="EPOCH_BOUGHT"
              />
              <ChartDisplay
                data={EPOCHSOLDData}
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
              <div className="text-sm text-gray-300">
                TOTAL_PREBUY_VOL
                <span className="text-white ml-1">
                  {data[0]?.total_flip_amount}
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
                data={EPOCHPREBUYVOLData}
                colors={["#FF9F40"]}
                title="EPOCH_PREBUY_VOL"
              />
              <ChartDisplay
                data={EPOCHPREBUYORDERData}
                colors={["#9966FF"]}
                title="EPOCH_PREBUY_ORDER"
              />
              <ChartDisplay
                data={EPOCHPREBUYUSERFLIPData}
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
              <div className="text-sm text-gray-300">
                TOTAL_POINT_VAL_FOR_LIKING
                <span className="text-white ml-1">
                  {data[0]?.total_like_reward}
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
                data={EPOCHLIKINGUSERData}
                colors={["#36A2EB"]}
                title="EPOCH_LIKING_USER"
              />
              <ChartDisplay
                data={EPOCHLIKINGData}
                colors={["#4BC0C0"]}
                title="EPOCH_LIKING"
              />
              <ChartDisplay
                data={[EPOCHLIKEREWARDData, EPOCHLIKEREWARDVALUEData]}
                colors={["#FF9F40", "#9966FF"]}
                title="EPOCH_POINT_FOR_LIKING"
              />
              <ChartDisplay
                data={EPOCHAVGPOINTFORLIKINGData}
                colors={["#FF6384"]}
                title="EPOCH_AVG_POINT_FOR_LIKING"
              />
              <ChartDisplay
                data={EPOCHIRData}
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
