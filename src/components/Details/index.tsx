import {
  calcByHealthFactor,
  calcByRepayRatio,
  getLiquidationDetail,
} from "@/services/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NEAR_META_DATA } from "../Icons";
import { toReadableNumber } from "@/utils/number";

export default function DetailPage() {
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("accountId")!;
    const position = urlParams.get("position")!;
    setAllTokenMetadatas(
      JSON.parse(localStorage.getItem("allTokenMetadatas")!)
    );
    if (accountId) {
      getLiquidationDetail(accountId, position).then((data) => {
        setLiquidationDetail(data);
      });
    }
  }, []);

  const handleRepayRatioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ratio = parseFloat(event.target.value);
    if (!isNaN(ratio)) {
      setRepayRatio(ratio.toString());
    } else {
      setRepayRatio("");
    }
  };

  const handleRrepayValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ratio = parseFloat(event.target.value);
    if (!isNaN(ratio)) {
      setRepayValue(ratio.toString());
    } else {
      setRepayValue("");
    }
  };

  const handleTargetHealthFactorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ratio = parseFloat(event.target.value);
    if (!isNaN(ratio)) {
      setTargetHealthFactor(ratio.toString());
    } else {
      setTargetHealthFactor("");
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
      style={{ maxWidth: "80vw", margin: "30px auto 50px auto" }}
    >
      <Link href="/" className="flex items-center text-base mb-4">
        <span className="mr-2">&#8592;</span>
        <p>Home</p>
      </Link>
      <AssetTable
        title="Collateral Assets"
        assets={liquidationDetail.collateralAssets || []}
        allTokenMetadatas={allTokenMetadatas}
        selectedTokenId={selectedCollateralTokenId}
        onTokenSelect={setSelectedCollateralTokenId}
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
            type="number"
            value={repayRatio}
            onChange={handleRepayRatioChange}
            className="input-style"
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
            <div className="flex items-center p-4">
              <p className="text-white text-base mr-2">repayValue:</p>
              <input
                type="number"
                value={repayValue}
                onChange={handleRrepayValueChange}
                className="input-style"
              />
            </div>
            <div className="flex items-center p-4">
              <p className="text-white text-base mr-2">targetHealthFactor:</p>
              <input
                type="number"
                value={targetHealthFactor}
                onChange={handleTargetHealthFactorChange}
                className="input-style"
              />
            </div>
            <button
              className={`calc-btn ${isButtonFactorLoading ? "disabled" : ""}`}
              onClick={handleByHealthFactor}
              disabled={isButtonFactorLoading}
            >
              {isButtonFactorLoading ? "..." : "Calc By Health Factor"}
            </button>
          </div>
        </div>
      )}
      {repayHealthFactor && Object.keys(repayHealthFactor).length > 0 && (
        <div className="mb-4 my-4 modalBox overflow-auto w-full p-4 bg-dark-250 rounded-2xl">
          <div className="text-white font-bold text-base mb-4">
            Health Factor
          </div>
          <div>
            {Object.keys(repayHealthFactor).map((key) => {
              const asset = repayHealthFactor[key];
              return (
                <div key={key} className="mb-2 flex">
                  <p>{key}:</p>
                  <pre>{asset}</pre>
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
  allTokenMetadatas: any;
  selectedTokenId: string;
  onTokenSelect: (tokenId: string) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({
  title,
  assets,
  allTokenMetadatas,
  selectedTokenId,
  onTokenSelect,
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
            let meta = allTokenMetadatas?.[asset.tokenId] || {};
            if (asset.tokenId === "wrap.near") {
              meta = NEAR_META_DATA;
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
                    <img
                      className="flex-shrink-0 w-5 h-5 rounded-full"
                      src={meta?.icon}
                    />
                    <span>{meta?.symbol}</span>
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
