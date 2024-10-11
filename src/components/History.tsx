import React, { useEffect, useState } from "react";
import { getHistoryData, getLiquidations } from "@/services/api";
import ReactPaginate from "react-paginate";
import { BeatLoading } from "./Loading";
import { formatTimestamp } from "@/utils/time";
import { CopyIcon, NEAR_META_DATA } from "./Icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LP_ASSET_MARK } from "@/services/config";
import { IAsset, IPool } from "@/interface/common";
import { ftGetTokenMetadata, get_pool } from "@/services/near";

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
  useEffect(() => {
    get_liquidations();
  }, []);
  useEffect(() => {
    get_history_data(currentPage + 1);
  }, [currentPage]);
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
  async function get_history_data(page: number | undefined) {
    setLoading(true);
    const res = await getHistoryData(page);
    if (res && res.data) {
      setHistoryData(res.data.record_list);
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
  return (
    <div
      className="text-white bg-dark-200 rounded-lg"
      style={{ maxWidth: "90vw", margin: "30px auto 50px auto" }}
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Record List(Total: {sizeCount})
      </div>
      {loading ? <BeatLoading /> : <div className="overflow-auto w-full text-xs">
        <table className="commonTable">
          <thead>
            <tr>
              <th>accountId</th>
              <th>receiptId</th>
              {/* <th>healthFactorAfter</th> */}
              <th>isRead</th>
              <th>isDeleted</th>
              <th>position</th>
              <th>liquidationType</th>
              {/* <th>healthFactorBefore</th> */}
              <th>RepaidAssets</th>
              <th>LiquidatedAssets</th>
              <th>createdAt</th>
              <th>updatedAt</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((l, index) => {
              // console.log(l.isRead);
              return (
                <tr
                  key={index}
                  className="hover:bg-dark-250 border-b border-dark-100"
                >
                  <td
                    title={l.account_id}
                    className="flex items-center justify-center relative cursor-pointer"
                  >
                    <div className="justify-self-start overflow-hidden w-48 whitespace-nowrap text-ellipsis">
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
                  <td title={l.receipt_id}>
                    <div className="flex items-center relative cursor-pointer">
                      <div className="justify-self-start overflow-hidden w-32 whitespace-nowrap text-ellipsis">
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
                  </td>

                  {/* <td>{l.healthFactor_after}</td> */}

                  <td>{l.isRead ? "true" : "false"}</td>
                  <td>{l.isDeleted ? "true" : "false"}</td>
                  <td>{l.position}</td>
                  <td>{l.liquidation_type}</td>
                  <td>
                    {l.RepaidAssets.map((asset: any, assetIndex: number) => {
                      const tokenMetadata =
                        asset.token_id === "wrap.near"
                          ? NEAR_META_DATA
                          : allTokenMetadatas[asset.token_id] || {};
                      return (
                        <div
                          key={assetIndex}
                          className="flex items-center space-x-2"
                        >
                          {tokenMetadata.icon && (
                            <img
                              src={tokenMetadata.icon}
                              alt={tokenMetadata.symbol}
                              className="flex-shrink-0 w-5 h-5 rounded-full"
                            />
                          )}
                          <span>
                            {tokenMetadata.symbol}
                            <br />
                            {asset.amount}
                          </span>
                        </div>
                      );
                    })}
                  </td>
                  <td>
                    {" "}
                    {l.LiquidatedAssets.map(
                      (asset: any, assetIndex: number) => {
                        const tokenMetadata =
                          asset.token_id === "wrap.near"
                            ? NEAR_META_DATA
                            : allTokenMetadatas[asset.token_id] || {};
                        return (
                          <div
                            key={assetIndex}
                            className="flex items-center space-x-2"
                          >
                            {tokenMetadata.icon && (
                              <img
                                src={tokenMetadata.icon}
                                alt={tokenMetadata.symbol}
                                className="flex-shrink-0 w-5 h-5 rounded-full"
                              />
                            )}
                            <span>
                              {tokenMetadata.symbol}
                              <br />
                              {asset.amount}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatTimestamp(l.createdAt)}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatTimestamp(l.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}
        {!loading && !historyData.length ? (
          <div className="flex items-center justify-center text-base text-dark-300 my-20">
            fetch data error...
          </div>
        ) : null}
      
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
