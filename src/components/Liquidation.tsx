import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Big from "big.js";
import { getLiquidations, getDemoLiquidations } from "../services/api";
import {
  ILiquidation,
  IAsset,
  TokenMetadata,
  ISortkey,
  IAssetsByType,
} from "../interface/common";
import { ftGetTokenMetadata } from "../services/near";
import { format_usd } from "../utils/number";
import Modal from "react-modal";
import AssetModal from "../components/AssetModal";
import { SortIcon } from "../components/Icons";
import { BeatLoading } from "../components/Loading";
import { formatTimestamp } from "@/utils/time";
Modal.defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
    outline: "none",
  },
  content: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -65%)",
    outline: "none",
  },
};
export default function Home(props: any) {
  const router = useRouter();
  const [liquidations, setLiquidations] = useState<ILiquidation[]>([]);
  const [assetsDetail, setAssetsDetail] = useState<IAssetsByType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<ISortkey>("healthFactor");
  const [sortDirection, setSortDirection] = useState("up");
  const [allTokenMetadatas, setAllTokenMetadatas] = useState<
    Record<string, TokenMetadata>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  useEffect(() => {
    get_liquidations();
  }, []);
  async function get_liquidations() {
    let liquidations;
    if (props.isDemo) {
      liquidations = await getDemoLiquidations();
    } else {
      const res = await getLiquidations();
      liquidations = res.data;
      setTimestamp(res.timestamp);
    }
    const tokenIdList = liquidations.reduce((acc: any, cur: any) => {
      cur.collateralAssets.forEach((asset: IAsset) => {
        acc.add(asset.tokenId);
      });
      cur.borrowedAssets.forEach((asset: IAsset) => {
        acc.add(asset.tokenId);
      });
      return acc;
    }, new Set());
    const requests = Array.from(tokenIdList).map(async (tokenId) => {
      return ftGetTokenMetadata(tokenId as string);
    });
    const metadatas = await Promise.all(requests);
    const map = metadatas.reduce((acc, metadata, index) => {
      return {
        ...acc,
        [Array.from(tokenIdList)[index] as string]: {
          ...metadata,
          id: Array.from(tokenIdList)[index] as string,
        },
      };
    }, {});
    setAllTokenMetadatas(map);
    setLiquidations(liquidations);
    sortInitialLiquidations(liquidations);
    setLoading(false);
  }
  function sortInitialLiquidations(liquidations: ILiquidation[]) {
    const sortedLiquidations = [...liquidations].sort((a, b) => {
      return Big(a.healthFactor).cmp(b.healthFactor);
    });
    setLiquidations(sortedLiquidations);
  }
  function showAssetsModal(
    accountId: string,
    position: string,
    collateralAssets: IAsset[],
    borrowedAssets: IAsset[]
  ) {
    const assetsByType: IAssetsByType = {
      Collateral: {
        type: "Collateral",
        assets: collateralAssets,
      },
      Borrowed: {
        type: "Borrowed",
        assets: borrowedAssets,
      },
      accountId,
      position,
    };
    setIsOpen(true);
    setAssetsDetail(assetsByType);
  }

  function closeAssetsModal() {
    setIsOpen(false);
    setAssetsDetail(null);
  }
  function sortClick(key: ISortkey) {
    const isCurrentlyAscending = sortKey === key && sortDirection === "up";
    const newSortDirection = isCurrentlyAscending ? "down" : "up";

    setSortKey(key);
    setSortDirection(newSortDirection);

    const sortedLiquidations = [...liquidations].sort((a, b) => {
      const valueA = Big(a[key]);
      const valueB = Big(b[key]);
      return newSortDirection === "up"
        ? valueA.sub(valueB).toNumber()
        : valueB.sub(valueA).toNumber();
    });

    setLiquidations(sortedLiquidations);
  }
  function handleDetailsClick(accountId: string, position: string) {
    router.push(`/details?accountId=${accountId}&position=${position}`);
    localStorage.setItem(
      "allTokenMetadatas",
      JSON.stringify(allTokenMetadatas)
    );
  }
  return (
    <div
      className="text-white bg-dark-200 rounded-lg"
      style={{ maxWidth: "76vw", margin: "30px auto 50px auto" }}
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Pending Liquidation (Total: {liquidations.length})
        <p className="ml-2">
          {timestamp !== null ? formatTimestamp(timestamp) : ""}
        </p>
      </div>
      <div className="overflow-auto w-full" style={{ maxHeight: "84vh" }}>
        <table className="commonTable">
          <thead>
            <tr>
              <th>serial</th>
              <th>accountId</th>
              <th>position</th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("healthFactor");
                  }}
                >
                  healthFactor
                  <SortComponent
                    keyName="healthFactor"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("collateralSum");
                  }}
                >
                  collateralSum{" "}
                  <SortComponent
                    keyName="collateralSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("borrowedSum");
                  }}
                >
                  borrowedSum{" "}
                  <SortComponent
                    keyName="borrowedSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("gapSum");
                  }}
                >
                  gapSum{" "}
                  <SortComponent
                    keyName="gapSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("adjustedCollateralSum");
                  }}
                >
                  adjustedCollateralSum{" "}
                  <SortComponent
                    keyName="adjustedCollateralSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("adjustedBorrowedSum");
                  }}
                >
                  adjustedBorrowedSum{" "}
                  <SortComponent
                    keyName="adjustedBorrowedSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("adjustedGapSum");
                  }}
                >
                  adjustedGapSum{" "}
                  <SortComponent
                    keyName="adjustedGapSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div className="flex justify-center whitespace-nowrap">
                  view details
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {liquidations.map((l, index) => {
              return (
                <tr key={l.accountId} className="hover:bg-dark-250">
                  <td className="h-16">
                    <span className="pl-2">{index + 1}</span>
                  </td>
                  <td title={l.accountId}>
                    <div className="justify-self-start overflow-hidden w-32 whitespace-nowrap text-ellipsis">
                      {l.accountId}
                    </div>
                  </td>
                  <td>{l.position}</td>
                  <td>{l.healthFactor}%</td>
                  <td title={l.collateralSum}>{format_usd(l.collateralSum)}</td>
                  <td title={l.borrowedSum}>{format_usd(l.borrowedSum)}</td>
                  <td title={l.gapSum}>{format_usd(l.gapSum)}</td>
                  <td title={l.adjustedCollateralSum}>
                    {format_usd(l.adjustedCollateralSum)}
                  </td>
                  <td title={l.adjustedBorrowedSum}>
                    {format_usd(l.adjustedBorrowedSum)}
                  </td>
                  <td title={l.adjustedGapSum}>
                    {format_usd(l.adjustedGapSum)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center px-3 h-8 cursor-pointer whitespace-nowrap underline"
                        onClick={() => {
                          handleDetailsClick(l.accountId, l.position);
                        }}
                      >
                        Details
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading ? <BeatLoading /> : null}
        {!loading && !liquidations.length ? (
          <div className="flex items-center justify-center text-base text-dark-300 my-20">
            fetch data error...
          </div>
        ) : null}
      </div>
      {/* {assetsDetail && (
        <AssetModal
          isOpen={isOpen}
          onRequestClose={closeAssetsModal}
          assets={assetsDetail}
          allTokenMetadatas={allTokenMetadatas}
          accountId={assetsDetail.accountId}
          position={assetsDetail.position}
        />
      )} */}
    </div>
  );
}

function SortComponent(props: any) {
  const { sortKey, sortDirection, keyName } = props;
  if (keyName !== sortKey) {
    return <SortIcon className="text-white text-opacity-30" />;
  } else if (sortDirection === "up") {
    return <SortIcon className="text-white transform rotate-180" />;
  } else {
    return <SortIcon className="text-white" />;
  }
}
