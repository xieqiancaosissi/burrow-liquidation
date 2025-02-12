import React, { useState, useEffect } from "react";
import ChartDisplay from "./ChartDisplay";

export default function StatisticTrendCharts() {
  const N = 30;
  const [latestEpochsData, setLatestEpochsData] = useState<number[]>([]);

  const generateRandomData = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
  };

  useEffect(() => {
    const simulatedData = generateRandomData(N);
    setLatestEpochsData(simulatedData);
  }, []);

  return (
    <div className="text-white">
      <div className="grid grid-cols-3 gap-4">
       <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
          <h3 className="text-xl font-bold mb-4">Revenue and Incentives</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">Accum. Rev. (sol)</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">Accum. Points & Value</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">Curr. Point/Sol Price</div>
              <div className="text-lg font-bold">0</div>
            </div>
          </div>
          <ChartDisplay data={latestEpochsData} colors={['#FF6384']} />
        </div>
        <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
          <h3 className="text-xl font-bold mb-4">MEME tokens</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">Accum. Created Memes</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">Accum. Graduated Memes</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">Accum. Hit Memes</div>
              <div className="text-lg font-bold">0</div>
            </div>
          </div>
          <ChartDisplay data={latestEpochsData} colors={['#36A2EB']} />
        </div>
        <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
          <h3 className="text-xl font-bold mb-4">Users Info</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">accumulated users</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">traded users</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">accumulated prebuy users</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">accumulated liking users</div>
              <div className="text-lg font-bold">0</div>
            </div>
          </div>
          <ChartDisplay data={latestEpochsData} colors={['#FFCE56']} />
        </div>
        <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
          <h3 className="text-xl font-bold mb-4">Trading Info</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">trading volume in sol</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">trading deals count</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">trading users count</div>
              <div className="text-lg font-bold">0</div>
            </div>
          </div>
          <ChartDisplay data={latestEpochsData} colors={['#4BC0C0']} />
        </div>
        <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
          <h3 className="text-xl font-bold mb-4"> PreBuy(flip) Info</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">prebuy volume in sol</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">prebuy orders count</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">prebuy users count</div>
              <div className="text-lg font-bold">0</div>
            </div>
          </div>
          <ChartDisplay data={latestEpochsData} colors={['#9966FF']} />
        </div>
        <div className="px-4 pt-4 border border-dark-100 rounded bg-dark-650 shadow-2xl">
          <h3 className="text-xl font-bold mb-4"> like info</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">distributed points for likers</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">liking users count</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">liking slide count</div>
              <div className="text-lg font-bold">0</div>
            </div>
            <div className="bg-dark-100 p-3 rounded">
              <div className="text-sm text-gray-300 truncate">invalid like count</div>
              <div className="text-lg font-bold">0</div>
            </div>
          </div>
          <ChartDisplay data={latestEpochsData} colors={['#FF9F40']} />
        </div>
      </div>
    </div>
  );
}
