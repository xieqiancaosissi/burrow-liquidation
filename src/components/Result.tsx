import { getLiquidationResult } from "@/services/api";
import React, { useEffect, useState } from "react";
import { BeatLoading } from "./Loading";
import ReactPaginate from "react-paginate";
import { CopyIcon, SortIcon } from "./Icons";
import CopyToClipboard from "react-copy-to-clipboard";
import { toReadableDecimalsNumber, toReadableNumber } from "@/utils/number";

interface LiquidationData {
  created_time: number;
  timestamp: number;
  updated_time: number;
  tx_id: string;
  amount: number;
  status: string;
}

interface MetaData {
  created_time: string;
  timestamp: number;
  key: string;
  updated_time: string;
}

export default function Result() {
  const [data, setData] = useState<LiquidationData[]>([]);
  const [metadata, setMetadata] = useState<MetaData>({
    created_time: "",
    timestamp: 0,
    key: "",
    updated_time: "",
  });
  const [key, setKey] = useState("MainnetUtxos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [sortKey, setSortKey] = useState<string>("amount");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showCopyTooltip, setShowCopyTooltip] = useState<
    Record<string, boolean>
  >({});
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getLiquidationResult(key);
      if (result.code === 0) {
        const parsedData = JSON.parse(result.data.values).data;
        const sortedData = parsedData.utxos.sort(
          (a: { amount: number }, b: { amount: number }) => b.amount - a.amount
        );
        const total = sortedData.reduce(
          (acc: number, item: { amount: number }) => {
            const amount = Number(toReadableNumber(8, item.amount.toString()));
            return acc + amount;
          },
          0
        );
        setTotalAmount(total);
        setData(sortedData);
        setMetadata({
          created_time: result.data.created_time || "",
          timestamp: result.data.timestamp || 0,
          updated_time: result.data.updated_time || "",
          key: result.data.key || "",
        });
      }
      setLoading(false);

      setCurrentPage(0);
      setSortKey("amount");
      setSortDirection("desc");
    };
    fetchData();
  }, [key]);

  const handleKeyChange = (newKey: string) => {
    setKey(newKey);
  };

  const formatTimestamp = (timestamp: string | number) => {
    if (!timestamp) return "-";
    if (typeof timestamp === "number") {
      return new Date(timestamp * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleSort = (key: string) => {
    const direction =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);
  };

  const sortedItems = [...data]
    .sort((a, b) => {
      if (sortKey === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortKey === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    })
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleCopy = (identifier: string) => {
    setShowCopyTooltip((prev) => ({ ...prev, [identifier]: true }));
    setTimeout(() => {
      setShowCopyTooltip((prev) => ({ ...prev, [identifier]: false }));
    }, 500);
  };

  return (
    <div className="text-white bg-dark-200 rounded-lg responsiveResultContainer">
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Liquidation Result
        <span className="mx-2">
          (Total Length: {data.length}, Total Amount: {totalAmount})
        </span>
        {formatTimestamp(metadata.updated_time)}
      </div>
      <div className=" px-6 pt-4 pb-2">
        <div className="flex gap-x-10">
          <div
            onClick={() => handleKeyChange("MainnetUtxos")}
            className={`flex justify-center px-4 py-2 items-center text-center text-black rounded-xl cursor-pointer md:text-base md:px-4 xsm:text-sm xsm:px-3 ${
              key === "MainnetUtxos" ? "bg-green-50" : "bg-dark-550"
            }`}
          >
            Mainnet Utxos
          </div>
          <div
            onClick={() => handleKeyChange("PriveMainnetUtxos")}
            className={`flex justify-center px-4 py-2 items-center text-center text-black rounded-xl cursor-pointer md:text-base md:px-4 xsm:text-sm xsm:px-3 ${
              key === "PriveMainnetUtxos" ? "bg-green-50" : "bg-dark-550"
            }`}
          >
            Prive Mainnet Utxos
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center my-4">
          <BeatLoading />
        </div>
      ) : (
        <>
          {/* <div className="flex gap-x-10 px-6 pb-2 md:text-base md:flex-row xsm:flex-col xsm:gap-y-2 xsm:text-sm">
            <p>
              <span className="text-purple-50">Timestamp:</span>{" "}
              {formatTimestamp(metadata.timestamp)}
            </p>
            <p>
              <span className="text-purple-50">Created Time:</span>{" "}
              {formatTimestamp(metadata.created_time)}
            </p>
            <p>
              <span className="text-purple-50">Updated Time:</span>{" "}
              {formatTimestamp(metadata.updated_time)}
            </p>
          </div> */}
          <div className="overflow-auto w-full">
            <table className="commonTable xsm:text-sm w-full">
              <thead>
                <tr>
                  <th>TX ID</th>
                  <th>
                    <div
                      className="flex items-center gap-1.5 cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <span>Amount</span>
                      <SortComponent
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        keyName="amount"
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      className="flex items-center gap-1.5 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <span>Status</span>
                      <SortComponent
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        keyName="status"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item, index) => (
                  <tr key={item.tx_id} className="xsm:text-sm">
                    <td className="flex items-center relative cursor-pointer">
                      <div className="justify-self-start overflow-hidden w-auto md:w-96 xsm:w-48 whitespace-nowrap text-ellipsis text-base mr-2">
                        <span>{item.tx_id}</span>
                      </div>
                      <CopyToClipboard
                        text={item.tx_id}
                        onCopy={() => handleCopy(index + "tx_id")}
                      >
                        <CopyIcon />
                      </CopyToClipboard>
                      {showCopyTooltip[index + "tx_id"] && (
                        <span className="absolute -top-2 bg-black text-white text-xs py-1 px-2 rounded">
                          Copied!
                        </span>
                      )}
                    </td>
                    <td>{toReadableNumber(8, item.amount.toString())}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination-container"}
            activeClassName={"active-page"}
          />
        </>
      )}
    </div>
  );
}

function SortComponent(props: any) {
  const { sortKey, sortDirection, keyName } = props;
  if (keyName !== sortKey) {
    return <SortIcon className="text-white text-opacity-30" />;
  } else if (sortDirection === "asc") {
    return <SortIcon className="text-white transform rotate-180" />;
  } else {
    return <SortIcon className="text-white" />;
  }
}
