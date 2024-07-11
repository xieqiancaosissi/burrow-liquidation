import {
  calcByHealthFactor,
  calcByRepayRatio,
  getLiquidationDetail,
} from "@/services/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NEAR_META_DATA } from "../Icons";
import { toReadableNumber } from "@/utils/number";
import { LP_ASSET_MARK } from "@/services/config";
import { TokenMetadata } from "@/interface/common";

export default function DetailPage() {
  const [accountId, setAccountId] = useState<string>("");
  const [liquidationDetail, setLiquidationDetail] = useState<any>({});
  const [allTokenMetadatas, setAllTokenMetadatas] = useState<any>({});
  const [repayRatioData, setRepayRatioData] = useState<any>([]);
  const [repayHealthFactor, setRepayHealthFactor] = useState<any>({});
  const [selectedCollateralTokenId, setSelectedCollateralTokenId] =
    useState<string>("");
  const [selectedBorrowedTokenId, setSelectedBorrowedTokenId] =
    useState<string>("");
  const [repayRatio, setRepayRatio] = useState<string>("");
  const [repayValue, setRepayValue] = useState<string>("");
  const [targetHealthFactor, setTargetHealthFactor] = useState<string>("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isButtonFactorLoading, setIsButtonFactorLoading] = useState(false);
  const [lpAssets, setLpAssets] = useState<Record<string, any>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("accountId")!;
    const position = urlParams.get("position")!;
    setAllTokenMetadatas(
      JSON.parse(localStorage.getItem("allTokenMetadatas")!)
    );
    setLpAssets(JSON.parse(localStorage.getItem("lpAssets")!));
    if (accountId) {
      setAccountId(accountId);
      getLiquidationDetail(accountId, position).then((data) => {
        setLiquidationDetail(data);
      });
    }
  }, []);

  const handleRepayRatioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setRepayRatio(value);
    }
  };

  const handleRrepayValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setRepayValue(event.target.value);
    }
  };

  const handleTargetHealthFactorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTargetHealthFactor(event.target.value);
    }
  };
  const handleConfirmSelection = async () => {
    setIsButtonLoading(true);
    let numericRepayRatio = parseFloat(repayRatio);
    if (isNaN(numericRepayRatio)) {
      numericRepayRatio = 0;
    }
    try {
      const result = await calcByRepayRatio(
        liquidationDetail.accountId,
        liquidationDetail.position,
        selectedCollateralTokenId,
        selectedBorrowedTokenId,
        numericRepayRatio
      );
      if (result.error) {
        console.error(result.error);
      } else {
        setRepayRatioData(result.data);
        setRepayValue(result.data[0].repay.toString());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsButtonLoading(false);
    }
  };
  const handleByHealthFactor = async () => {
    setIsButtonFactorLoading(true);
    let numericRepayValue = parseFloat(repayValue);
    if (isNaN(numericRepayValue)) {
      numericRepayValue = 0;
    }
    let numericTargetHealthFactor = parseFloat(targetHealthFactor);
    try {
      const result = await calcByHealthFactor(
        liquidationDetail.accountId,
        liquidationDetail.position,
        selectedCollateralTokenId,
        selectedBorrowedTokenId,
        numericRepayValue,
        numericTargetHealthFactor
      );
      if (result.error) {
        console.error(result.error);
      } else {
        setRepayHealthFactor(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsButtonFactorLoading(false);
    }
  };
  return (
    <div
      className="text-white bg-dark-200 rounded-lg p-4"
      style={{ maxWidth: "76vw", margin: "30px auto 50px auto" }}
    >
      <Link href="/" className="flex items-center text-base mb-4">
        <span className="mr-2">&#8592;</span>
        <p>Home</p>
      </Link>
      <div className="ml-2 flex items-center">
        <p>accountId:</p>
        <p className="ml-2 text-lg">{accountId}</p>
      </div>
      <AssetTable
        title="Collateral Assets"
        assets={liquidationDetail.collateralAssets || []}
        allTokenMetadatas={allTokenMetadatas}
        selectedTokenId={selectedCollateralTokenId}
        onTokenSelect={setSelectedCollateralTokenId}
        lpAssets={lpAssets}
      />
      <AssetTable
        title="Borrowed Assets"
        assets={liquidationDetail.borrowedAssets || []}
        allTokenMetadatas={allTokenMetadatas}
        selectedTokenId={selectedBorrowedTokenId}
        onTokenSelect={setSelectedBorrowedTokenId}
      />
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center p-4">
          <p className="text-white text-base mr-2">repayRatio:</p>
          <input
            type="text"
            value={repayRatio}
            onChange={handleRepayRatioChange}
            className="input-style"
            pattern="\d*\.?\d*"
          />
        </div>
        <button
          className={`calc-btn ${isButtonLoading ? "disabled" : ""}`}
          onClick={handleConfirmSelection}
          disabled={isButtonLoading}
        >
          {isButtonLoading ? "..." : "Calc By Repay Ratio"}
        </button>
      </div>
      {repayRatioData && repayRatioData.length > 0 && (
        <div className="mb-4 my-4 modalBox overflow-auto w-full p-4 bg-dark-250 rounded-2xl">
          <div className="text-white font-bold text-base">Repay Ratio</div>
          <table className="modalTable">
            <thead>
              <tr>
                <th>claim</th>
                <th>newHealthFactor</th>
                <th>originalHealthFactor</th>
                <th>profit</th>
                <th>repay</th>
              </tr>
            </thead>
            <tbody>
              {repayRatioData &&
                repayRatioData.map((asset: any) => {
                  let meta = allTokenMetadatas?.[asset.tokenId] || {};
                  if (asset.tokenId === "wrap.near") {
                    meta = NEAR_META_DATA;
                  }
                  return (
                    <tr key={asset.claim}>
                      <td>{asset.claim}</td>
                      <td>{asset.newHealthFactor}</td>
                      <td>{asset.originalHealthFactor}</td>
                      <td>{asset.profit}</td>
                      <td>{asset.repay}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center p-4">
                <p className="text-white text-base mr-2">repayValue:</p>
                <input
                  type="text"
                  value={repayValue}
                  onChange={handleRrepayValueChange}
                  className="input-style"
                  pattern="\d*\.?\d*"
                />
              </div>
              <div className="flex items-center p-4">
                <p className="text-white text-base mr-2">targetHealthFactor:</p>
                <input
                  type="text"
                  value={targetHealthFactor}
                  onChange={handleTargetHealthFactorChange}
                  className="input-style"
                  pattern="\d*\.?\d*"
                />
              </div>
            </div>
            <button
              className={`calc-btn ${isButtonFactorLoading ? "disabled" : ""}`}
              onClick={handleByHealthFactor}
              disabled={isButtonFactorLoading}
            >
              {isButtonFactorLoading ? "..." : "Generate Liquidation Command"}
            </button>
          </div>
        </div>
      )}
      {repayHealthFactor && Object.keys(repayHealthFactor).length > 0 && (
        <div className="mb-4 my-4 modalBox overflow-auto w-full p-4 bg-dark-250 rounded-2xl">
          <div className="text-white font-bold text-base mb-4">
            Liquidation Command
          </div>
          <div>
            {Object.keys(repayHealthFactor)
              .slice(0, 2)
              .map((key, index) => {
                const asset = repayHealthFactor[key];
                return (
                  <div key={key} className="mb-2">
                    <p className="mb-2">{key}:</p>
                    <pre
                      className="text-white p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap word-break"
                      style={{ background: "#0b1a1a" }}
                    >
                      <code>{asset}</code>
                    </pre>
                  </div>
                );
              })}
            {Object.keys(repayHealthFactor)
              .slice(2)
              .map((key, index) => {
                const asset = repayHealthFactor[key];
                return (
                  <div key={key} className="mb-2 flex">
                    <p className="mr-2">{key}:</p>
                    <p>{asset}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

interface AssetTableProps {
  title: string;
  assets: any[];
  allTokenMetadatas: Record<string, TokenMetadata>;
  selectedTokenId: string;
  onTokenSelect: (tokenId: string) => void;
  lpAssets?: Record<string, string[]>;
}

const AssetTable: React.FC<AssetTableProps> = ({
  title,
  assets,
  allTokenMetadatas,
  selectedTokenId,
  onTokenSelect,
  lpAssets,
}) => {
  useEffect(() => {
    if (assets.length > 0 && !selectedTokenId) {
      onTokenSelect(assets[0].tokenId);
    }
  }, [assets, selectedTokenId, onTokenSelect]);
  return (
    <div className="mb-4 my-4 modalBox overflow-auto w-full p-4 bg-dark-250 rounded-2xl">
      <div className="text-white font-bold text-base">{title}</div>
      <table className="modalTable">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Token Balance</th>
            <th>Value</th>
            <th>Adjusted Value</th>
            <th>Shares</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset: any) => {
            let metas: TokenMetadata[] = [];
            let meta: any = {};
            let isLpAsset: boolean = false;
            if (asset.tokenId.includes(LP_ASSET_MARK)) {
              const tokenIds = lpAssets![asset.tokenId];
              isLpAsset = true;
              metas = tokenIds.reduce((acc, cur: string) => {
                let meta = allTokenMetadatas?.[cur] as TokenMetadata;
                if (
                  asset.tokenId === "wrap.near" ||
                  asset.tokenId === "wrap.testnet"
                ) {
                  meta = NEAR_META_DATA;
                }
                acc.push(meta);
                return acc;
              }, [] as TokenMetadata[]);
            } else {
              meta = allTokenMetadatas?.[asset.tokenId] || {};
              if (
                asset.tokenId === "wrap.near" ||
                asset.tokenId === "wrap.testnet"
              ) {
                meta = NEAR_META_DATA;
              }
            }
            return (
              <tr key={asset.tokenId}>
                <td>
                  <div className="flex items-center gap-2 mr-10">
                    <div style={{ width: "16px", height: "16px" }}>
                      <input
                        type="radio"
                        className="radio-custom"
                        name={title}
                        value={asset.tokenId}
                        checked={selectedTokenId === asset.tokenId}
                        onChange={() => onTokenSelect(asset.tokenId)}
                      />
                    </div>
                    {isLpAsset ? (
                      <div className="flex items-center gap-2 pr-4">
                        <div className="flex items-center flex-shrink-0">
                          {metas.map((meta: TokenMetadata, index) => {
                            return <img
                              key={meta?.id + index}
                              src={meta?.icon}
                              className={`flex-shrink-0 w-5 h-5 rounded-full ${
                                index !== 0 ? "-ml-1.5" : ""
                              }`}
                            />;
                          })}
                        </div>
                        <div className="flex items-center">
                        {metas.map((meta: TokenMetadata, index) => {
                            return <span
                              className="whitespace-nowrap"
                              key={meta?.symbol + index}>
                                {meta?.symbol}{index == metas.length - 1 ? '': '-'}
                              </span>
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <img
                          className="flex-shrink-0 w-5 h-5 rounded-full"
                          src={meta?.icon}
                        />
                        <span>{meta?.symbol}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {toReadableNumber(meta?.decimals || 0, asset.tokenBalance)}
                </td>
                <td>${asset.value}</td>
                <td>${asset.adjustedValue}</td>
                <td>{asset.shares}</td>
                <td>{asset.balance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
