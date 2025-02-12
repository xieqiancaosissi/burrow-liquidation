import { getDashBoardData } from "@/services/api";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { BeatLoading } from "../Loading";

export default function AlgorithmPerformance() {
  const [data, setData] = useState<any>({
    last_swap_reward_value: 0,
    last_like_reward_value: 0,
    last_revenue: 0,
    user_count_each_level: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashBoardData();
      if (res?.data?.data) {
        setData(res.data.data[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const revenueOption = {
    title: {
      text: "Revenue Distribution",
      left: "25%",
      top: 60,
      textStyle: {
        color: "#C0C4E9",
        fontSize: 20,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "#333",
      textStyle: { color: "#C0C4E9", fontSize: 12 },
    },
    legend: {
      orient: "vertical",
      right: "5%",
      bottom: "5%",
      textStyle: {
        color: "#C0C4E9",
        fontSize: 12,
      },
      itemGap: 12,
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: "Revenue",
        type: "pie",
        radius: ["45%", "60%"],
        center: ["40%", "60%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#14162b",
          borderWidth: 1,
          shadowBlur: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
        },
        label: {
          show: false,
          position: "center",
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontSize: '20',
            color: '#C0C4E9',
          },
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
        },
        data: [
          {
            value: data?.last_swap_reward_value || 0,
            name: "Swap Reward",
            itemStyle: { color: "rgba(54, 162, 235, 0.8)" },
          },
          {
            value: data?.last_like_reward_value || 0,
            name: "Like Reward",
            itemStyle: { color: "rgba(255, 205, 86, 0.8)" },
          },
          {
            value: Math.max(
              0,
              (data?.last_revenue) -
                (data?.last_swap_reward_value) -
                (data?.last_like_reward_value )
            ) || 0,
            name: "Others",
            itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
          },
        ],
      },
    ],
  };

  const totalRevenue = data?.last_swap_reward_value + data?.last_like_reward_value + Math.max(
    0,
    (data?.last_revenue) -
      (data?.last_swap_reward_value) -
      (data?.last_like_reward_value )
  ) || 0;

  if (totalRevenue === 0) {
    revenueOption.series[0].data = [
      { value: 1, name: "No Data", itemStyle: { color: "rgba(128, 128, 128, 0.8)" } },
    ];
  }

  const userLevelOption = {
    title: {
      text: "User Ranking",
      left: "29%",
      top: 60,
      textStyle: {
        color: "#C0C4E9",
        fontSize: 20,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} users ({d}%)",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "#333",
      textStyle: { color: "#C0C4E9", fontSize: 12 },
    },
    legend: {
      orient: "vertical",
      right: "5%",
      bottom: "5%",
      textStyle: {
        color: "#C0C4E9",
        fontSize: 12,
      },
      itemGap: 12,
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: "User Ranking",
        type: "pie",
        radius: ["45%", "60%"],
        center: ["40%", "60%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#14162b",
          borderWidth: 1,
          shadowBlur: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
        },
        label: {
          show: false,
          position: "center",
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontSize: '20',
            color: '#C0C4E9',
          },
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
        },
        data:
          data.user_count_each_level?.map((count: number, index: number) => ({
            value: count,
            name: `Level ${index + 1}`,
            itemStyle: {
              color: [
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 205, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 99, 132, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
              ][index],
            },
          })) || [],
      },
    ],
  };

  if (data.user_count_each_level?.every((count: number) => count === 0)) {
    userLevelOption.series[0].data = [
      { value: 1, name: "No Data", itemStyle: { color: "rgba(128, 128, 128, 0.8)" } },
    ];
  }

  function renderStatistics(label: string, data: any[], columnCount: number) {
    return (
      <div className="w-full text-white mb-4">
        <div className="text-purple-50 font-bold mb-2">{label}</div>
        <div className="flex flex-wrap -mx-4">
          {data.map(({ label, value }) => (
            <div className={`w-${12 / columnCount} px-2 pb-4`} key={label}>
              <div className="bg-dark-100 p-3 rounded-lg shadow-md w-full">
                <div>
                  {label}: {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoading />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-4/6 h-full">
            <div className="flex-1 flex flex-row flex-wrap">
              <div className="w-1/2 h-full">
                <div className="w-full h-96 flex items-center justify-center text-purple-50">
                  <ReactECharts
                    option={revenueOption}
                    style={{ width: "100%", height: "100%" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              </div>
              <div className="w-1/2 h-full">
                <div className="w-full h-96 flex items-center justify-center text-purple-50">
                  <ReactECharts
                    option={userLevelOption}
                    style={{ width: "100%", height: "100%" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 text-white">
              <p className="flex items-center text-purple-50 text-lg font-bold mb-4">
                Statistics
              </p>
              {renderStatistics(
                "Common",
                [
                  { label: "point/sol price", value: data?.swap_token_price },
                  { label: "current factor I_r", value: data?.last_ir },
                ],
                4
              )}
              {renderStatistics(
                "Ranking",
                data.user_count_each_level?.map((count: number, index: number) => ({
                  label: `Level ${index + 1}`,
                  value: count,
                })) || [],
                4
              )}
              {renderStatistics(
                "Trading Incentives (A)",
                [
                  {
                    label: "distributed points",
                    value: data?.epoch_launched_reward,
                  },
                  {
                    label: "distributed value",
                    value: data?.epoch_launched_reward_value,
                  },
                ],
                4
              )}
              {renderStatistics(
                "Bonding Curve Incentives (B & C)",
                [
                  { label: "meme count", value: data?.epoch_meme_created_count},
                  {
                    label: "total creator points and value",
                    value: data?.epoch_launched_creator_reward,
                  },
                  {
                    label: "average creator points and value",
                    value: data?.epoch_launched_creator_reward / data?.epoch_meme_created_count * data?.like_i_max || '0',
                  },
                  { label: "total pre-liker points", value: data?.total_launched_creator_reward },
                  { label: "total pre-liker value", value: data?.total_launched_creator_reward_value },
                  {
                    label: "average pre-liker points and value",
                    value: data?.total_launched_creator_reward / data?.hit_bonding_curve_n * data?.like_i_max,
                  },
                  { label: "the lowest and highest points for a per-liker in the previous epoch",  value: "-",}
                ],
                4
              )}
              {renderStatistics(
                "Liker Incentives (D)",
                [
                  { label: "like-action count", value: data?.epoch_like_count },
                  {
                    label: "like-action users count",
                    value: data?.epoch_like_user_count,
                  },
                  { label: "total liker points", value: data?.epoch_like_reward },
                  { label: "total liker value", value: data?.epoch_like_reward_value },
                  {
                    label: "average liker points per like-action",
                    value: data?.epoch_like_reward / data?.epoch_like_count || "-",
                  },
                  {
                    label: "invalid like count",
                    value: data?.epoch_invalid_like_count,
                  },
                  {
                    label: "average graduation rate",
                    value: "-",
                  },
                  {
                    label: "average bonding curve rate",
                    value: data?.hit_bonding_curve_dr,
                  },
                  {
                    label: "average accumulated volume",
                    value: "-",
                  },
                  {
                    label: "combined std-dev",
                    value: "-",
                  },
                ],
                4
              )}
            </div>
          </div>
          <div className="w-2/6 p-6">
            <p className="flex items-center text-purple-50 text-lg font-bold mb-4">
              Current Configuration
            </p>
            {renderStatistics(
              "Trading",
              [
                { label: "Buy Fee Rate", value: data?.buy_fee_rate },
                { label: "Sell Fee Rate", value: data?.sell_fee_rate },
              ],
              2
            )}
            {renderStatistics(
              "Ranking",
              [
                {
                  label: "Rates",
                  value: (data?.ranking_rates || []).join(", "),
                },
                { label: "SBRs", value: (data?.ranking_sbrs || []).join(", ") },
                { label: "K", value: data?.ranking_k },
                { label: "Pump Rate", value: data?.ranking_pump_rate },
              ],
              2
            )}
            {renderStatistics(
              "Hit Bonding Curve",
              [
                { label: "N", value: data?.hit_bonding_curve_n },
                { label: "Min Rev", value: data?.hit_bonding_curve_rev_min },
                { label: "DR1", value: data?.hit_bonding_curve_dr },
                { label: "Swap DR", value: data?.swap_dr },
              ],
              4
            )}
            {renderStatistics(
              "TradingIncentives",
              [
                { label: "Ipvn", value: data?.swap_ipvn },
                { label: "Ipvi", value: data?.swap_ipvi },
              ],
              4
            )}
            {renderStatistics(
              " Graduation Rate Reward",
              [
                { label: "Log Base", value: data?.like_log_base },
                { label: "Alpha", value: data?.like_alpha },
                { label: "Beta", value: data?.like_beta },
                { label: "Gamma", value: data?.like_gamma },
                { label: "Zs", value: data?.like_zs },
                { label: "Zr", value: data?.like_zr },
                { label: "Is", value: data?.like_i_s },
                { label: "Imin", value: data?.like_i_min },
                { label: "Imax", value: data?.like_i_max },
                { label: "Ir", value: data?.like_i_r },
              ],
              4
            )}
          </div>
        </>
      )}
    </div>
  );
}
