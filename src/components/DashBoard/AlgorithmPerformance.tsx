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
      right: "15%",
      bottom: "5%",
      textStyle: {
        color: "#C0C4E9",
        fontSize: 12,
      },
      itemGap: 12,
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        const value =
          revenueOption.series[0].data.find(
            (item: { name: string; value: number }) => item.name === name
          )?.value || 0;
        return `${name}: ${value}`;
      },
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
            value: Math.max(0, data?.last_revenue) || 0,
            name: "Total",
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
        name: "Total",
        itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
      },
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
      right: "15%",
      bottom: "5%",
      textStyle: {
        color: "#C0C4E9",
        fontSize: 12,
      },
      itemGap: 12,
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        const value =
          userLevelOption.series[0].data.find(
            (item: { name: string; value: number }) => item.name === name
          )?.value || 0;
        return `${name}: ${value}`;
      },
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
  }: {
    label?: string;
    data: {
      label: string;
      value: any;
      valueDetail?: string;
      isError?: boolean;
    }[];
  }) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const formatValue = (value: any) => {
      if (value === null) return "0";

      if (Array.isArray(value)) {
        return value.join(", ");
      }

      const numericValue =
        typeof value === "string" ? parseFloat(value) : value;

      if (isNaN(numericValue)) {
        return "0";
      }

      return Number(numericValue.toFixed(4)).toString();
    };

    return (
      <div className="w-full text-white">
        {label && <div className="text-purple-50 font-bold mb-2">{label}</div>}
        <div className="flex flex-wrap -mx-4">
          {data.map(({ label, value, valueDetail, isError }) => {
            const isRed = isError;
            return (
              <div className={`w-auto px-2 pb-4`} key={label}>
                <div
                  className={`${
                    valueDetail ? "cursor-pointer hover:bg-opacity-50" : ""
                  } bg-dark-100 p-3 rounded-lg shadow-md w-full relative`}
                  onMouseEnter={() => valueDetail && setHoveredItem(label)}
                  onMouseLeave={() => valueDetail && setHoveredItem(null)}
                >
                  <div className={isRed ? "text-red-500" : ""}>
                    {label}: {formatValue(value)}
                    {hoveredItem === label && valueDetail && (
                      <div className="w-auto flex items-center absolute z-10 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm -top-12 left-1/2 transform -translate-x-1/2">
                        {valueDetail}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const Is = data?.like_i_s;
  const Imin = data?.like_i_min;
  const ULR_FOR_MIN = data?.like_min_reward_upper_limit_rate;
  const range = ((Is - Imin) * (ULR_FOR_MIN - 1)) / Imin;

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
                latest performance
              </p>
              <StatisticsSection
                label="Common Info"
                data={[
                  { label: "price", value: data?.token_price },
                  { label: "prev ir", value: data?.pre_ir },
                  { label: "cur ir", value: data?.last_ir },
                  { label: "prev DR Swap", value: data?.pre_swap_dr },
                  { label: "cur DR Swap", value: data?.swap_dr },
                ]}
              />
              <StatisticsSection
                label="Trading Incentives (A)"
                data={[
                  {
                    label: "internal tokens",
                    value: data?.total_invalid_like_count,
                  },
                  {
                    label: "external tokens",
                    value: data?.total_min_reward_like_count,
                  },
                ]}
              />
              <StatisticsSection
                label="Launched Incentives (B & C)"
                data={[
                  { label: "new meme", value: data?.epoch_meme_created_count },
                  {
                    label: "launching meme",
                    value: data?.epoch_meme_launching_count,
                  },
                  {
                    label: "launched meme",
                    value: data?.epoch_meme_launched_count,
                  },
                ]}
              />
              <StatisticsSection
                data={[
                  {
                    label: "creator token",
                    value: data?.epoch_launched_reward,
                    valueDetail: `${data?.epoch_launched_reward_value}`,
                  },
                  {
                    label: "avg token",
                    value:
                      data?.epoch_launched_reward /
                      data?.epoch_meme_launched_count,
                    valueDetail: `${
                      data?.epoch_launched_reward_value /
                      data?.epoch_meme_launched_count
                    }`,
                  },
                ]}
              />
              <StatisticsSection
                data={[
                  {
                    label: "pre liker token",
                    value: data?.epoch_like_reward,
                    valueDetail: `${data?.epoch_like_reward_value}`,
                  },
                  {
                    label: "avg token",
                    value: data?.epoch_like_reward / data?.hit_bonding_curve_n,
                    valueDetail: `${
                      data?.epoch_like_reward_value / data?.hit_bonding_curve_n
                    }`,
                  },
                  {
                    label: "min token",
                    value: data?.like_i_min,
                  },
                  {
                    label: "max token",
                    value: data?.like_i_max,
                  },
                ]}
              />
              <StatisticsSection
                label="Liker Incentives (D)"
                data={[
                  { label: "liking", value: data?.epoch_like_count },
                  {
                    label: "invalid liking",
                    value: data?.epoch_invalid_like_count,
                  },
                  { label: "minimum reward", value: data?.epoch_min_reward_like_count },
                ]}
              />
              <StatisticsSection
                data={[
                  { label: "liking user", value: data?.epoch_like_user_count },
                  {
                    label: "liking token",
                    value: data?.epoch_like_reward,
                    valueDetail: `${data?.epoch_like_reward_value}`,
                  },
                  {
                    label: "avg token",
                    value:
                      data?.epoch_like_reward / data?.epoch_like_user_count,
                    valueDetail: `${
                      data?.epoch_like_reward_value /
                      data?.epoch_like_user_count
                    }`,
                  },
                ]}
              />
              <StatisticsSection
                data={[
                  { label: "u0", value: data?.like_u0 },
                  { label: "u1", value: data?.like_u1 },
                  { label: "u2", value: data?.like_u2 },
                  { label: "std dev", value: data?.std },
                ]}
              />
            </div>
          </div>
          <div className="w-2/6 p-6">
            <p className="flex items-center text-purple-50 text-lg font-bold mb-4">
              current algorithm configuration
            </p>
            <StatisticsSection
              label="Fee"
              data={[
                { label: "Buy Fee", value: data?.buy_fee_rate },
                { label: "Sell Fee", value: data?.sell_fee_rate },
              ]}
            />
            <StatisticsSection
              label="User Ranking"
              data={[
                {
                  label: "Volume Criteria",
                  value: data?.ranking_rates || [],
                },
                { label: "SBRs", value: data?.ranking_sbrs || [] },
                { label: "K", value: data?.ranking_k },
                { label: "ECR", value: data?.ranking_pump_rate },
                { label: "ECV", value: data?.user_level_max_external_vol },
              ]}
            />
            <StatisticsSection
              label="Launched Incentive"
              data={[
                { label: "N", value: data?.hit_bonding_curve_n },
                { label: "min Rev", value: data?.hit_bonding_curve_rev_min },
                { label: "DR Preliker", value: data?.hit_bonding_curve_dr },
                { label: "min Point", value: data?.last_hit_bonding_reward_last },
                { label: "max Point", value: data?.last_hit_bonding_reward_top },
                {
                  label: "DR Creator",
                  value: data?.hit_bonding_curve_creator_dr,
                },
              ]}
            />
            <StatisticsSection
              label="Trading Incentive"
              data={[
                { label: "Ipvn", value: data?.swap_ipvn },
                { label: "Ipvi", value: data?.swap_ipvi },
                { label: "DR Trading", value: data?.swap_dr },
                {
                  label: "MaxAdjR",
                  value: data?.swap_max_adjust_rate_dr,
                },
              ]}
            />
            <StatisticsSection label="Liking Incentive" data={[]} />
            <StatisticsSection
              label="Weight of 3 dimensions"
              data={[
                { label: "Alpha", value: data?.like_alpha },
                { label: "Beta", value: data?.like_beta },
                { label: "Gamma", value: data?.like_gamma },
              ]}
            />
            <StatisticsSection
              label="Volume dimension params"
              data={[
                { label: "recent n", value: data?.like_recent_n },
                { label: "VirtualVolSpan", value: data?.like_virtual_vol_span },
                { label: "VirtualVolDiscount", value: data?.like_virtual_vol_discount },
                {
                  label: "max acc vol",
                  value: data?.like_multi_robot_max_m_count,
                },
                { label: "base", value: data?.like_log_base },
                {
                  label: "ERS",
                  value: data?.like_extension_rate_slash,
                },
                { label: "OR e2", value: data?.like_e2 },
              ]}
            />
            <StatisticsSection
              label="Z and Incentive range params"
              data={[
                { label: "Zs", value: data?.like_zs },
                { label: "Zr", value: data?.like_zr },
                { label: "Imin", value: data?.like_i_min },
                { label: "Is", value: data?.like_i_s },
                { label: "Imax", value: data?.like_i_max },
              ]}
            />
            <StatisticsSection
              label="Auto-adjustment params"
              data={[
                { label: "Ir", value: data?.like_i_r },
                {
                  label: "tdr liking",
                  value: data?.like_tdr,
                },
                {
                  label: "MaxAdj liking",
                  value: data?.like_ir_max_adjust_rate,
                },
              ]}
            />
            <StatisticsSection
              label="Antibot params"
              data={[
                {
                  label: "ulr for min",
                  value: data?.like_min_reward_upper_limit_rate,
                },
                {
                  label: "antibot range",
                  value: range,
                },
                {
                  label: "X",
                  value: data?.like_item_robot_check_x_time
                    ? (data.like_item_robot_check_x_time / 600).toFixed(2)
                    : null,
                },
                { label: "N", value: data?.like_item_robot_check_n_count },
                { label: "K", value: data?.like_multi_robot_max_k_rate },
                { label: "M", value: data?.like_multi_robot_max_m_count },
              ]}
            />
            <StatisticsSection
              label="Social Sharing Incentive"
              data={[
                {
                  label: "epoch window",
                  value: 144 * 7,
                  isError: true,
                },
                { label: "DR sharing", value: 0.025, isError: true },
              ]}
            />
            <StatisticsSection
              label="Tiktok"
              data={[
                {
                  label: "MaxFollowerNum",
                  value: 1000000,
                  isError: true,
                },
                { label: "log base", value: 2, isError: true },
              ]}
            />
            <StatisticsSection
              data={[
                {
                  label: "MaxViewer",
                  value: 100000,
                  isError: true,
                },
                { label: "VCR", value: "[0.0001, 0.001]", isError: true },
              ]}
            />
            <StatisticsSection
              data={[
                {
                  label: "MaxLiker",
                  value: 10000,
                  isError: true,
                },
                { label: "LCR", value: "[0.001, 0.01]", isError: true },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
