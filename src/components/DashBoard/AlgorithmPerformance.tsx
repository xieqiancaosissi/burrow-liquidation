import { getDashBoardData } from "@/services/api";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { BeatLoading } from "../Loading";
import { useDashboard } from "@/context/DashboardContext";

export default function AlgorithmPerformance() {
  const { toggleComponent } = useDashboard();
  const [data, setData] = useState<any>({});
  const [previousData, setPreviousData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashBoardData();
      if (res?.data?.data) {
        setData(res.data.data[0]);
        setPreviousData(res.data.data[1]);
      }
      setLoading(false);
    };
    fetchData();

    // Temporarily disabled auto-refresh
    // const intervalId = setInterval(fetchData, 60000);
    // return () => clearInterval(intervalId);
  }, []);

  // Revenue Distribution chart
  const revenueOption = {
    title: {
      text: "Revenue Distribution",
      left: "center",
      top: 0,
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
      orient: "horizontal",
      bottom: 0,
      left: "center",
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
        radius: ["60%", "75%"],
        center: ["50%", "52%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#14162b",
          borderWidth: 0,
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
            value:
              parseFloat(data?.total_revenue || 0) -
              parseFloat(data?.total_raydium_revenue || 0) -
              parseFloat(data?.total_meteora_revenue || 0),
            name: "FlipN Revenue",
            itemStyle: { color: "rgba(54, 162, 235, 0.8)" },
          },
          {
            value: parseFloat(data?.total_raydium_revenue || 0),
            name: "Raydium Revenue",
            itemStyle: { color: "rgba(255, 205, 86, 0.8)" },
          },
          {
            value: parseFloat(data?.total_meteora_revenue || 0),
            name: "Meteora Revenue",
            itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
          },
        ],
      },
    ],
  };

  // User Ranking chart
  const userLevelOption = {
    title: {
      text: "User Ranking",
      left: "center",
      top: 0,
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
      orient: "horizontal",
      bottom: 0,
      left: "center",
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
        radius: ["60%", "75%"],
        center: ["50%", "52%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#14162b",
          borderWidth: 0,
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

  // 3. Incentive Token Distribution Chart
  const incentiveOption = {
    title: {
      text: "Incentive Token Distribution",
      left: "center",
      top: 0,
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
      orient: "horizontal",
      bottom: 0,
      left: "center",
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
        name: "Incentive",
        type: "pie",
        radius: ["60%", "75%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#14162b",
          borderWidth: 0,
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
            value: parseFloat(data?.total_trade_reward || 0),
            name: "Trading Incentive",
            itemStyle: { color: "rgba(54, 162, 235, 0.8)" },
          },
          {
            value: parseFloat(data?.total_launched_creator_reward || 0),
            name: "Creator Incentive",
            itemStyle: { color: "rgba(255, 205, 86, 0.8)" },
          },
          {
            value: 0, // Social sharing incentives (to be added in the future)
            name: "Social Sharing Incentive",
            itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
          },
        ],
      },
    ],
  };

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

      // Format based on value size to ensure consistency
      if (Math.abs(numericValue) >= 1000) {
        return numericValue.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
      } else if (Math.abs(numericValue) >= 1) {
        return numericValue.toFixed(4);
      } else {
        // For small decimal values
        return numericValue.toFixed(6);
      }
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end w-full">
        <button
          onClick={() => toggleComponent()}
          className="p-2 text-white rounded"
        >
          Switch to Time Based Charts {">"}
        </button>
      </div>

      <div className="flex flex-col h-full">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoading />
          </div>
        ) : (
          <>
            {/* Top charts area */}
            <div className="flex flex-row justify-center gap-12 mb-6">
              <div className="w-1/3">
                <div className="w-full h-80 flex items-center justify-center text-purple-50 relative">
                  <ReactECharts
                    option={revenueOption}
                    style={{ width: "100%", height: "100%" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              </div>
              <div className="w-1/3">
                <div className="w-full h-80 flex items-center justify-center text-purple-50 relative">
                  <ReactECharts
                    option={userLevelOption}
                    style={{ width: "100%", height: "100%" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              </div>
              <div className="w-1/3">
                <div className="w-full h-80 flex items-center justify-center text-purple-50 relative">
                  <ReactECharts
                    option={incentiveOption}
                    style={{ width: "100%", height: "100%" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom left and right areas */}
            <div className="flex">
              {/* Bottom left - data display area */}
              <div className="w-3/5 p-4">
                <StatisticsSection
                  label="Acc Trading Statistics"
                  data={[
                    {
                      label: "Native Vol",
                      value: parseFloat(data?.total_flip_amount || 0),
                    },
                    {
                      label: "Raydium Vol",
                      value:
                        parseFloat(data?.total_raydium_trade_buy_amount || 0) +
                        parseFloat(data?.total_raydium_trade_sell_amount || 0),
                    },
                    {
                      label: "Meteora Vol",
                      value:
                        parseFloat(data?.total_meteora_trade_buy_amount || 0) +
                        parseFloat(data?.total_meteora_trade_sell_amount || 0),
                    },
                    {
                      label: "External Vol",
                      value:
                        parseFloat(data?.total_pump_trade_buy_amount || 0) +
                        parseFloat(data?.total_pump_trade_sell_amount || 0),
                    },
                  ]}
                />

                <StatisticsSection
                  label="Acc Trading Incentives"
                  data={[
                    { label: "pre DR", value: data?.pre_ir },
                    { label: "cur DR", value: data?.swap_dr },
                    {
                      label: "For Native",
                      value: data?.total_trade_flip_reward,
                    },
                    {
                      label: "For Raydium",
                      value: data?.total_trade_raydium_reward,
                    },
                    {
                      label: "For Meteora",
                      value: data?.total_trade_meteora_reward,
                    },
                    {
                      label: "For External",
                      value: data?.total_trade_pump_reward,
                    },
                  ]}
                />

                <StatisticsSection
                  label="Acc Meme Created"
                  data={[
                    {
                      label: "On Native",
                      value:
                        data?.total_meme_created_count -
                        (data?.total_meme_raydium_launched_count || 0) -
                        (data?.total_meme_meteora_launched_count || 0),
                    },
                    {
                      label: "On Raydium",
                      value: data?.total_meme_raydium_launched_count,
                    },
                    {
                      label: "On Meteora",
                      value: data?.total_meme_meteora_launched_count,
                    },
                  ]}
                />

                <StatisticsSection
                  label="Acc Meme Launched"
                  data={[
                    {
                      label: "On Native",
                      value:
                        data?.total_meme_launched_count -
                        (data?.total_meme_raydium_launched_count || 0) -
                        (data?.total_meme_meteora_launched_count || 0),
                    },
                    {
                      label: "On Raydium",
                      value: data?.total_meme_raydium_launched_count,
                    },
                    {
                      label: "On Meteora",
                      value: data?.total_meme_meteora_launched_count,
                    },
                  ]}
                />

                <StatisticsSection
                  label="Creator Incentives"
                  data={[
                    {
                      label: "For Native",
                      value:
                        parseFloat(data?.total_launched_creator_reward || 0) -
                        parseFloat(
                          data?.total_launched_raydium_creator_reward || 0
                        ) -
                        parseFloat(
                          data?.total_launched_meteora_creator_reward || 0
                        ),
                    },
                    {
                      label: "For Raydium",
                      value: data?.total_launched_raydium_creator_reward,
                    },
                    {
                      label: "For Meteora",
                      value: data?.total_launched_meteora_creator_reward,
                    },
                  ]}
                />

                <StatisticsSection
                  label="Social Sharing"
                  data={[
                    { label: "Twitter shares", value: "N/A" },
                    { label: "Discord shares", value: "N/A" },
                  ]}
                />

                <StatisticsSection
                  label="Social Sharing Incentives"
                  data={[
                    { label: "Twitter incentives", value: "N/A" },
                    { label: "Discord incentives", value: "N/A" },
                  ]}
                />
              </div>

              {/* Bottom right - algorithm parameter display area */}
              <div className="w-2/5 p-4">
                <p className="flex items-center text-purple-50 text-lg font-bold mb-4">
                  Current Algorithm Configuration
                </p>
                <StatisticsSection
                  data={[
                    {
                      label: "token price",
                      value: data?.token_price || 0.0001,
                    },
                    { label: "buy fee", value: data?.buy_fee_rate },
                    { label: "sell fee", value: data?.sell_fee_rate },
                    { label: "raydium discount", value: 0.75 },
                    { label: "meteora discount", value: 0.9 },
                    { label: "epoch last", value: data?.epoch_time || 3600 },
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
                    {
                      label: "min Rev",
                      value: data?.hit_bonding_curve_rev_min,
                    },
                    {
                      label: "DR Creator",
                      value: data?.hit_bonding_curve_creator_dr,
                    },
                  ]}
                />

                <StatisticsSection
                  label="Trading Incentive"
                  data={[
                    { label: "IPVinternal", value: data?.swap_ipvn },
                    { label: "IPVexternal", value: data?.swap_ipvi },
                    { label: "DR Trading", value: data?.swap_dr },
                    { label: "MaxAdjR", value: data?.swap_max_adjust_rate_dr },
                    { label: "MaxDR", value: data?.swap_max_dr || 0.35 },
                    {
                      label: "LatestDRWindow",
                      value: data?.swap_adjust_dr_recent_n || 24,
                    },
                  ]}
                />

                <StatisticsSection
                  label="Social Sharing Incentive"
                  data={[
                    { label: "epoch window", value: 24 * 7 },
                    { label: "DR sharing", value: 0.025 },
                  ]}
                />

                <StatisticsSection
                  label="Twitter"
                  data={[
                    { label: "MaxFollower", value: 1000000 },
                    { label: "log base", value: 2 },
                    { label: "MaxViewing", value: 100000 },
                    { label: "VCR", value: "[0.0001, 0.001]" },
                    { label: "MaxLiking", value: 10000 },
                    { label: "LCR", value: "[0.001, 0.01]" },
                  ]}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
