import { getDashBoardData } from "@/services/api";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function DashBoardPage() {
  const [data, setData] = useState<any>({
    last_swap_reward_value: 0,
    last_like_reward_value: 0,
    last_revenue: 0,
    user_count_each_level: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashBoardData();
      if (res?.data?.data) {
        setData(res.data.data);
      }
    };
    fetchData();
  }, []);

  const revenueOption = {
    title: {
      text: "Revenue Distribution",
      left: "25%",
      top: 40,
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
        radius: "70%",
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
              (data?.last_revenue || 0) -
                (data?.last_swap_reward_value || 0) -
                (data?.last_like_reward_value || 0)
            ),
            name: "Others",
            itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
          },
        ],
      },
    ],
  };

  const userLevelOption = {
    title: {
      text: "User Ranking",
      left: "29%",
      top: 40,
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
        radius: "70%",
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
      <div className="flex flex-col w-4/6 h-full">
        <div className="flex-1 flex flex-row flex-wrap">
          <div className="w-1/2 h-full p-4">
            <div className="w-full h-96 flex items-center justify-center text-purple-50">
              <ReactECharts
                option={revenueOption}
                style={{ width: "100%", height: "100%" }}
                opts={{ renderer: "svg" }}
              />
            </div>
          </div>
          <div className="w-1/2 h-full p-4">
            <div className="w-full h-full flex items-center justify-center text-purple-50">
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
              { label: "Total Revenue", value: data?.total_revenue },
              { label: "Total Reward", value: data?.total_reward },
              { label: "Last Epoch ID", value: data?.last_epoch_id + 1 },
              { label: "Last Revenue", value: data?.last_revenue },
              { label: "Last Reward", value: data?.last_reward },
              { label: "Last Reward Value", value: data?.last_reward_value },
              {
                label: "Hit Bonding Curve Token Price",
                value: data?.hit_bonding_curve_token_price,
              },
              { label: "Last IR", value: data?.last_ir },
              { label: "Pre IR", value: data?.pre_ir },
              { label: "Like IR", value: data?.like_i_r },
            ],
            4
          )}
          {renderStatistics(
            "Ranking",
            [
              {
                label: "User Count Each Level",
                value: data?.user_count_each_level,
              },
            ],
            4
          )}
          {renderStatistics(
            "HitBondingCurve",
            [
              {
                label: "Last Hit Bonding Reward Creator",
                value: data?.last_hit_bonding_reward_creator,
              },
              {
                label: "Last Hit Bonding Reward Last",
                value: data?.last_hit_bonding_reward_last,
              },
              {
                label: "Last Hit Bonding Reward Top",
                value: data?.last_hit_bonding_reward_top,
              },
              {
                label: "Last Launched Reward",
                value: data?.last_launched_reward,
              },
              {
                label: "Last Launched Reward Value",
                value: data?.last_launched_reward_value,
              },
            ],
            4
          )}
          {renderStatistics(
            "TradingIncentives",
            [
              { label: "Last Swap Reward", value: data?.last_swap_reward },
              {
                label: "Last Swap Reward Value",
                value: data?.last_swap_reward_value,
              },
            ],
            4
          )}
          {renderStatistics(
            "Graduation Rate Reward",
            [
              { label: "Last Like Reward", value: data?.last_like_reward },
              {
                label: "Last Like Reward Value",
                value: data?.last_like_reward_value,
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
            { label: "Rates", value: (data?.ranking_rates || []).join(", ") },
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
    </div>
  );
}
