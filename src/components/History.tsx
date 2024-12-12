import React, { useEffect, useState } from "react";
import {
  getHistoryData,
  getLiquidations,
  getPerice,
  getTxId,
} from "@/services/api";
import ReactPaginate from "react-paginate";
import { BeatLoading } from "./Loading";
import { formatTimestamp } from "@/utils/time";
import { CopyIcon, NEAR_META_DATA, SortIcon } from "./Icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LP_ASSET_MARK } from "@/services/config";
import { IAsset, IPool } from "@/interface/common";
import { ftGetTokenMetadata, get_pool } from "@/services/near";
import { toReadableDecimalsNumber, toReadableNumber } from "@/utils/number";

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [sizeCount, setSizeCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allTokenMetadatas, setAllTokenMetadatas] = useState<any>({});
  const [showCopyTooltip, setShowCopyTooltip] = useState<
    Record<string, boolean>
  >({});
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLiquidationType, setSelectedLiquidationType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allTokenPrices, setAllTokenPrices] = useState<any>({});
  useEffect(() => {
    get_liquidations();
    get_allPerice_data();
  }, []);
  useEffect(() => {
    get_history_data(currentPage + 1);
  }, [currentPage, sortField, sortOrder, selectedLiquidationType]);
  async function get_liquidations() {
    let liquidations;
    const res = await getLiquidations();
    liquidations = res.data;
    const lpAssetIds: any = new Set([]);
    const tokenIdList = liquidations.reduce((acc: any, cur: any) => {
      cur.collateralAssets.forEach((asset: IAsset) => {
        if (asset.tokenId.includes(LP_ASSET_MARK)) {
          lpAssetIds.add(asset.tokenId);
        } else {
          acc.add(asset.tokenId);
        }
      });
      cur.borrowedAssets.forEach((asset: IAsset) => {
        acc.add(asset.tokenId);
      });
      return acc;
    }, new Set());
    const lpAssetIdsArray: string[] = Array.from(lpAssetIds);
    const pool_ids: string[] = [];
    const poolRequests = lpAssetIdsArray.map(async (lpAssetId: string) => {
      const pool_id = lpAssetId.split("-")[1];
      pool_ids.push(pool_id);
      return get_pool(pool_id);
    });
    const pools = await Promise.all(poolRequests);
    const temp: string[] = [];
    pools.forEach((pool: IPool) => {
      temp.push(...pool.token_account_ids);
    });
    const allTokenIds = Array.from(
      new Set(temp.concat(Array.from(tokenIdList)))
    );
    const requests = allTokenIds.map(async (tokenId) => {
      return ftGetTokenMetadata(tokenId as string);
    });
    const metadatas = await Promise.all(requests);
    const map = metadatas.reduce((acc, metadata, index) => {
      return {
        ...acc,
        [Array.from(allTokenIds)[index] as string]: {
          ...metadata,
          id: Array.from(allTokenIds)[index] as string,
        },
      };
    }, {});
    setAllTokenMetadatas(map);
  }
  async function get_history_data(page: number) {
    setLoading(true);
    const res = await getHistoryData(page, 10, sortField, sortOrder);
    if (res && res.data) {
      let filteredData = res.data.record_list;
      if (selectedLiquidationType !== "all") {
        filteredData = filteredData.filter(
          (item: { liquidation_type: string }) =>
            item.liquidation_type === selectedLiquidationType
        );
      }
      console.log(filteredData);
      setHistoryData(filteredData);
      setPageCount(res.data.total_page);
      setSizeCount(res.data.total_size);
      setLoading(false);
    }
  }
  const handlePageClick = (data: {
    selected: React.SetStateAction<number>;
  }) => {
    setCurrentPage(data.selected);
  };
  const handleSort = (field: React.SetStateAction<string>) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSelectChange = (value: React.SetStateAction<string>) => {
    setSelectedLiquidationType(value);
    setIsModalOpen(false);
  };

  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const handleCopy = (identifier: string) => {
    setShowCopyTooltip((prevState) => ({ ...prevState, [identifier]: true }));
    setTimeout(() => {
      setShowCopyTooltip((prevState) => ({
        ...prevState,
        [identifier]: false,
      }));
    }, 500);
  };
  async function handleTxClick(receipt_id: string, url: string) {
    try {
      const data = await getTxId(receipt_id);
      if (data && data.receipts && data.receipts.length > 0) {
        const txHash = data.receipts[0].originated_from_transaction_hash;
        window.open(`${url}/${txHash}`, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching transaction data:",
        error
      );
    }
  }
  async function get_allPerice_data() {
    const res = await getPerice();
    setAllTokenPrices(res);
  }
  return (
    <div
      className="text-white bg-dark-200 rounded-lg responsiveContainer"
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Record List(Total: {sizeCount})
      </div>
      {loading ? (
        <BeatLoading />
      ) : (
        <div className="overflow-auto w-full text-xs">
          <table className="commonTable">
            <thead>
              <tr>
                <th>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer w-24"
                    onClick={() => handleSort("account_id")}
                  >
                    accountId
                    <SortComponent
                      keyName="account_id"
                      sortKey={sortField}
                      sortDirection={sortOrder}
                    />
                  </div>
                </th>
                <th>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer w-42"
                    onClick={() => handleSort("liquidation_account_id")}
                  >
                    liquidationAccountId
                    <SortComponent
                      keyName="liquidation_account_id"
                      sortKey={sortField}
                      sortDirection={sortOrder}
                    />
                  </div>
                </th>
                {/* <th>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer  w-64"
                    onClick={() => handleSort("receipt_id")}
                  >
                    receiptId
                    <SortComponent
                      keyName="receipt_id"
                      sortKey={sortField}
                      sortDirection={sortOrder}
                    />
                  </div>
                </th> */}
                <th>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer  w-24"
                    onClick={() => handleSort("position")}
                  >
                    Position
                    <SortComponent
                      keyName="position"
                      sortKey={sortField}
                      sortDirection={sortOrder}
                    />
                  </div>
                </th>
                <th>
                  Repaid Assets
                </th>
                <th>
                  Liquidated Assets
                </th>
                <th>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer"
                    onClick={() => handleSort("timestamp")}
                  >
                    Created At
                    <SortComponent
                      keyName="timestamp"
                      sortKey={sortField}
                      sortDirection={sortOrder}
                    />
                  </div>
                </th>
                <th>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>liquidationType:</span>
                    <button onClick={() => setIsModalOpen(true)} className="">
                      {selectedLiquidationType}
                    </button>
                    {isModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-dark-200 rounded-lg shadow-lg p-5 w-64">
                          <h3 className="text-lg font-semibold mb-4">
                            Select Type
                          </h3>
                          <select
                            value={selectedLiquidationType}
                            onChange={(e) => handleSelectChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                          >
                            <option value="all">All</option>
                            <option value="liquidate">Liquidation</option>
                            <option value="both">Both</option>
                          </select>
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 w-full text-black px-3 py-2 rounded-md focus:outline-none"
                            style={{ background: "rgb(210, 255, 58)" }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((l, index) => {
                return (
                  <tr
                    key={index}
                    className="hover:bg-dark-250 border-b border-dark-100"
                  >
                    <td
                      title={l.account_id}
                      className="flex items-center justify-center relative cursor-pointer"
                    >
                      <div className="justify-self-start overflow-hidden w-32 whitespace-nowrap text-ellipsis text-base">
                        <span>{l.account_id}</span>
                      </div>
                      <CopyToClipboard
                        text={l.account_id}
                        onCopy={() => handleCopy(index + "account_id")}
                      >
                        <CopyIcon />
                      </CopyToClipboard>
                      {showCopyTooltip[index + "account_id"] && (
                        <span className="absolute -top-2 bg-black text-white text-xs py-1 px-2 rounded">
                          Copied!
                        </span>
                      )}
                    </td>
                    <td title={l.liquidation_account_id}>
                      <div className="flex items-center relative cursor-pointer text-base">
                        <div className="justify-self-start overflow-hidden w-48 whitespace-nowrap text-ellipsis">
                          <span>{l.liquidation_account_id}</span>
                        </div>
                        <CopyToClipboard
                          text={l.liquidation_account_id}
                          onCopy={() =>
                            handleCopy(index + "liquidation_account_id")
                          }
                        >
                          <CopyIcon />
                        </CopyToClipboard>
                        {showCopyTooltip[index + "liquidation_account_id"] && (
                          <span className="absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded">
                            Copied!
                          </span>
                        )}
                      </div>
                    </td>
                    {/* <td title={l.receipt_id}>
                      <div className="flex items-center relative cursor-pointer">
                        <div className="justify-self-start overflow-hidden w-64 whitespace-nowrap text-ellipsis">
                          <span>{l.receipt_id}</span>
                        </div>
                        <CopyToClipboard
                          text={l.receipt_id}
                          onCopy={() => handleCopy(index + "receipt_id")}
                        >
                          <CopyIcon />
                        </CopyToClipboard>
                        {showCopyTooltip[index + "receipt_id"] && (
                          <span className="absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded">
                            Copied!
                          </span>
                        )}
                      </div>
                    </td> */}
                    <td>
                      <div className="text-base w-32">{l.position}</div>
                    </td>
                    <td>
                      {(() => {
    const repaidAssets = Array.isArray(l.RepaidAssets) ? l.RepaidAssets : [];
    
    const totalValue = repaidAssets.reduce(
                          (
                            total: number,
                            asset: {
                              token_id: string;
                              amount: string | undefined;
                            }
                          ) => {
                            const tokenMetadata =
                              asset.token_id === "wrap.near"
                                ? NEAR_META_DATA
                                : allTokenMetadatas[asset.token_id] || {};
                            const tokenPrice = allTokenPrices[asset.token_id];

                            const assetValue = tokenPrice
                              ? parseFloat(
                                  toReadableDecimalsNumber(
                                    tokenMetadata?.decimals || 0,
                                    asset.amount
                                  )
                                ) * tokenPrice.price
                              : 0;

                            return total + assetValue;
                          },
                          0
                        );
                        return (
                          <div className="text-sm">
                            <div className="mb-1  whitespace-nowrap">
                              Total Value: ${totalValue.toFixed(4)}
                            </div>
                            {l.RepaidAssets && l.RepaidAssets.map(
                              (asset: any, assetIndex: number) => {
                                const tokenMetadata =
                                  asset.token_id === "wrap.near"
                                    ? NEAR_META_DATA
                                    : allTokenMetadatas[asset.token_id] || {};
                                const assetAmount = parseFloat(
                                  toReadableDecimalsNumber(
                                    tokenMetadata?.decimals || 0,
                                    asset.amount
                                  )
                                );
                                return (
                                  <div
                                    key={assetIndex}
                                    className="flex items-center space-x-2 overflow-hidden whitespace-nowrap text-ellipsis mb-1"
                                  >
                                    <span>
                                      {tokenMetadata.symbol}：
                                      {assetAmount.toFixed(4)}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td>
                      {(() => {
    const liquidatedAssets = Array.isArray(l.LiquidatedAssets) ? l.LiquidatedAssets : [];
    
    const totalValue = liquidatedAssets.reduce(
                          (
                            total: number,
                            asset: {
                              token_id: string;
                              amount: string | undefined;
                            }
                          ) => {
                            const tokenMetadata =
                              asset.token_id === "wrap.near"
                                ? NEAR_META_DATA
                                : allTokenMetadatas[asset.token_id] || {};
                            const tokenPrice = allTokenPrices[asset.token_id];

                            const assetValue = tokenPrice
                              ? parseFloat(
                                  toReadableDecimalsNumber(
                                    tokenMetadata?.decimals || 0,
                                    asset.amount
                                  )
                                ) * tokenPrice.price
                              : 0;

                            return total + assetValue;
                          },
                          0
                        );
                        return (
                          <div className="text-sm">
                            <div className="mb-1 whitespace-nowrap">
                            Total Value: ${totalValue.toFixed(2)}
                            </div>
                            {l.LiquidatedAssets && l.LiquidatedAssets.map(
                              (asset: any, assetIndex: number) => {
                                const tokenMetadata =
                                  asset.token_id === "wrap.near"
                                    ? NEAR_META_DATA
                                    : allTokenMetadatas[asset.token_id] || {};
                                const assetAmount = parseFloat(
                                  toReadableDecimalsNumber(
                                    tokenMetadata?.decimals || 0,
                                    asset.amount
                                  )
                                );
                                return (
                                  <div
                                    key={assetIndex}
                                    className="flex items-center space-x-2 overflow-hidden whitespace-nowrap text-ellipsis mb-1"
                                  >
                                    <span>
                                      {tokenMetadata.symbol}：
                                      {assetAmount.toFixed(4)}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    <td className="whitespace-nowrap w-48">
                      <div
                        className="underline cursor-pointer text-base"
                        onClick={() =>
                          handleTxClick(
                            l.receipt_id,
                            `https://nearblocks.io/txns`
                          )
                        }
                      >
                        {formatTimestamp(l.createdAt)}
                      </div>
                    </td>
                    <td><div className="text-base w-32">
                    {l.liquidation_type}
                      </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && historyData.length === 0 && (
        <div className="flex items-center justify-center text-base text-dark-300 my-20">
          No data
        </div>
      )}

      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active-page"}
      />
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
