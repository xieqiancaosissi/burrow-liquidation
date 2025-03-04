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

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
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
          show: true,
          position: "outside",
          formatter: "{b}: {c} ({d}%)",
          textStyle: {
            fontSize: "10",
            color: "#C0C4E9",
          },
        },
        labelLine: {
          show: true,
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
            value:
              Math.max(
                0,
                data?.last_revenue -
                  data?.last_swap_reward_value -
                  data?.last_like_reward_value
              ) || 0,
            name: "Others",
            itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
          },
        ],
      },
    ],
  };

  const totalRevenue =
    data?.last_swap_reward_value +
      data?.last_like_reward_value +
      Math.max(
        0,
        data?.last_revenue -
          data?.last_swap_reward_value -
          data?.last_like_reward_value
      ) || 0;

  if (totalRevenue === 0) {
    revenueOption.series[0].data = [
      {
        value: 0,
        name: "Swap Reward",
        itemStyle: { color: "rgba(54, 162, 235, 0.8)" },
      },
      {
        value: 0,
        name: "Like Reward",
        itemStyle: { color: "rgba(255, 205, 86, 0.8)" },
      },
      {
        value: 0,
        name: "Others",
        itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
      },
    ];
  }

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
          show: true,
          position: "outside",
          formatter: "{b}: {c} ({d}%)",
          textStyle: {
            fontSize: "10",
            color: "#C0C4E9",
          },
        },
        labelLine: {
          show: true,
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
      {
        value: 1,
        name: "No Data",
        itemStyle: { color: "rgba(128, 128, 128, 0.8)" },
      },
    ];
  }

  function StatisticsSection({
    label,
    data,
    columnCount,
  }: {
    label: string;
    data: any[];
    columnCount: number;
  }) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    return (
      <div className="w-full text-white">
        {label && <div className="text-purple-50 font-bold mb-2">{label}</div>}
        <div className="flex flex-wrap -mx-4">
          {data.map(({ label, value, valueDetail }) => (
            <div className={`w-${12 / columnCount} px-2 pb-4`} key={label}>
              <div
                className={`${
                  valueDetail ? "cursor-pointer hover:bg-opacity-50" : ""
                } bg-dark-100 p-3 rounded-lg shadow-md w-full relative`}
                onMouseEnter={() => valueDetail && setHoveredItem(label)}
                onMouseLeave={() => valueDetail && setHoveredItem(null)}
              >
                <div>
                  {label}: {valueDetail ? <span>{value}</span> : value}
                  {hoveredItem === label && valueDetail && (
                    <div className="w-auto flex items-center absolute z-10 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm -top-12 left-1/2 transform -translate-x-1/2">
                      {valueDetail}
                    </div>
                  )}
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
              <StatisticsSection
                label="Common"
                data={[
                  { label: "Price", value: data?.token_price },
                  { label: "Prev_ir", value: data?.pre_ir },
                  { label: "Cur_ir", value: data?.last_ir },
                  { label: "Prev_swap_dr", value: data?.pre_swap_dr },
                  { label: "Cur_swap_dr", value: data?.swap_dr },
                ]}
                columnCount={5}
              />
              <StatisticsSection
                label="Trading Incentives (A)"
                data={[
                  {
                    label: "Point_for_trading",
                    value: data?.total_launched_reward,
                    valueDetail: `${data?.total_launched_reward_value}`,
                  },
                ]}
                columnCount={1}
              />
              <StatisticsSection
                label="Bonding Curve Incentives (B & C)"
                data={[
                  { label: "New_meme", value: data?.total_meme_created_count },
                  {
                    label: "Launching_meme",
                    value: data?.total_meme_launching_count,
                  },
                  {
                    label: "Launched_meme",
                    value: data?.total_meme_launched_count,
                  },
                ]}
                columnCount={3}
              />
              <StatisticsSection
                label=""
                data={[
                  {
                    label: "Point_for_creators",
                    value: data?.total_launched_creator_reward,
                    valueDetail: `${data?.total_launched_creator_reward_value}`,
                  },
                  {
                    label: "Avg_point_per_creator",
                    value:
                      data?.total_launched_creator_reward /
                      data?.total_meme_created_count,
                    valueDetail: `${
                      data?.total_launched_creator_reward_value /
                      data?.total_meme_created_count
                    }`,
                  },
                ]}
                columnCount={3}
              />
              <StatisticsSection
                label=""
                data={[
                  {
                    label: "Point_for_early_likers",
                    value: data?.total_like_reward,
                    valueDetail: `${data?.total_like_reward_value}`,
                  },
                  {
                    label: "Avg_point_per_early_liker",
                    value: data?.total_like_reward / data?.hit_bonding_curve_n,
                    valueDetail: `${
                      data?.total_like_reward_value / data?.hit_bonding_curve_n
                    }`,
                  },
                  {
                    label: "Min_point_for_early_liker",
                    value: data?.like_i_min,
                  },
                  {
                    label: "Max_point_for_early_liker",
                    value: data?.like_i_max,
                  },
                ]}
                columnCount={3}
              />
              <StatisticsSection
                label="Liker Incentives (D)"
                data={[
                  { label: "Liking", value: data?.total_like_count },
                  {
                    label: "Invalid_liking",
                    value: data?.total_invalid_like_count,
                  },
                  { label: "Minimum_reward_like_count", value: null },
                ]}
                columnCount={4}
              />
              <StatisticsSection
                label=""
                data={[
                  { label: "Liking_user", value: data?.total_like_user_count },
                  {
                    label: "Point_for_liking",
                    value: data?.total_like_reward,
                    valueDetail: `${data?.total_like_reward_value}`,
                  },
                  {
                    label: "Avg_point_per_liking",
                    value:
                      data?.total_like_reward / data?.total_like_user_count,
                    valueDetail: `${
                      data?.total_like_reward_value /
                      data?.total_like_user_count
                    }`,
                  },
                ]}
                columnCount={4}
              />
              <StatisticsSection
                label=""
                data={[
                  { label: "Avg_r0", value: null },
                  { label: "Avg_r1", value: null },
                  { label: "Avg_r2", value: null },
                  { label: "Std_dev", value: data?.std },
                ]}
                columnCount={4}
              />
            </div>
          </div>
          <div className="w-2/6 p-6">
            <p className="flex items-center text-purple-50 text-lg font-bold mb-4">
              Current Configuration
            </p>
            <StatisticsSection
              label="Trading"
              data={[
                { label: "Buy Fee Rate", value: data?.buy_fee_rate },
                { label: "Sell Fee Rate", value: data?.sell_fee_rate },
              ]}
              columnCount={2}
            />
            <StatisticsSection
              label="Ranking"
              data={[
                {
                  label: "Rates",
                  value: (data?.ranking_rates || []).join(", "),
                },
                { label: "SBRs", value: (data?.ranking_sbrs || []).join(", ") },
                { label: "K", value: data?.ranking_k },
                { label: "Pump Rate", value: data?.ranking_pump_rate },
              ]}
              columnCount={2}
            />
            <StatisticsSection
              label="Hit Bonding Curve"
              data={[
                { label: "N", value: data?.hit_bonding_curve_n },
                { label: "Min Rev", value: data?.hit_bonding_curve_rev_min },
                { label: "Max Point", value: null },
                { label: "DR Preliker", value: data?.hit_bonding_curve_dr },
                {
                  label: "DR Creator",
                  value: data?.hit_bonding_curve_creator_dr,
                },
              ]}
              columnCount={4}
            />
            <StatisticsSection
              label="TradingIncentives"
              data={[
                { label: "Ipvn", value: data?.swap_ipvn },
                { label: "Ipvi", value: data?.swap_ipvi },
                { label: "DR Trading", value: data?.swap_dr },
                {
                  label: "MaxAdj Trading",
                  value: data?.swap_max_adjust_rate_dr,
                },
              ]}
              columnCount={4}
            />
            <StatisticsSection
              label="Liking Reward"
              data={[]}
              columnCount={4}
            />
            <StatisticsSection
              label="Weight of 3 dimensions"
              data={[
                { label: "Alpha", value: data?.like_alpha },
                { label: "Beta", value: data?.like_beta },
                { label: "Gamma", value: data?.like_gamma },
              ]}
              columnCount={3}
            />
            <StatisticsSection
              label="Volume dimension params"
              data={[
                { label: "recent_n", value: data?.like_recent_n },
                {
                  label: "max_acc_vol",
                  value: data?.like_multi_robot_max_m_count,
                },
                { label: "base", value: data?.like_log_base },
                {
                  label: "extension_rate_slash",
                  value: data?.like_extension_rate_slash,
                },
                { label: "offset_rate_e2", value: data?.like_e2 },
              ]}
              columnCount={3}
            />
            <StatisticsSection
              label="Z and Incentive range params"
              data={[
                { label: "Zs", value: data?.like_zs },
                { label: "Zr", value: data?.like_zr },
                { label: "Imin", value: data?.like_i_min },
                { label: "Imax", value: data?.like_i_max },
                { label: "Is", value: data?.like_i_s },
              ]}
              columnCount={3}
            />
            <StatisticsSection
              label="Auto-adjustment params"
              data={[
                { label: "Ir", value: data?.like_i_r },
                {
                  label: "tdr_liking",
                  value: null,
                },
                {
                  label: "MaxAdj liking",
                  value: data?.like_ir_max_adjust_rate,
                },
              ]}
              columnCount={3}
            />
            <StatisticsSection
              label="Antibot params"
              data={[
                {
                  label: "Ulr_for_min",
                  value: data?.like_min_reward_upper_limit_rate,
                },
                {
                  label: "X",
                  value: `${data?.like_item_robot_check_x_time / 3600} hours`,
                },
                { label: "N", value: data?.like_item_robot_check_n_count },
                { label: "K", value: data?.like_multi_robot_max_k_rate },
                { label: "M", value: data?.like_multi_robot_max_m_count },
              ]}
              columnCount={3}
            />
            <StatisticsSection
              label="New User Policy"
              data={[
                {
                  label: "Limit_t",
                  value: `${data?.like_item_robot_check_x_time / 3600} hours`,
                },
                { label: "Limit_accv", value: 0 },
              ]}
              columnCount={4}
            />
          </div>
        </>
      )}
    </div>
  );
}
