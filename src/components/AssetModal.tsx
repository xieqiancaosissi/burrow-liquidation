import React, { useState } from "react";
import Modal from "react-modal";
import { CloseIcon, NEAR_META_DATA } from "./Icons";
import { IAsset, TokenMetadata } from "../interface/common";
import { format_usd, toReadableNumber } from "../utils/number";
import { calcByRepayRatio } from "@/services/api";

interface AssetModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  assets: {
    Collateral: { type: string; assets: IAsset[] };
    Borrowed: { type: string; assets: IAsset[] };
  };
  allTokenMetadatas: Record<string, TokenMetadata>;
  accountId: string;
  position: string;
}

export default function AssetModal({
  isOpen,
  onRequestClose,
  assets,
  allTokenMetadatas,
  accountId,
  position,
}: AssetModalProps) {
  const [selectedCollateralTokenId, setSelectedCollateralTokenId] =
    useState<string>("");
  const [selectedBorrowedTokenId, setSelectedBorrowedTokenId] =
    useState<string>("");
  const [repayRatio, setRepayRatio] = useState<string>("");

  const handleCollateralTokenSelection = (tokenId: string) => {
    setSelectedCollateralTokenId(tokenId);
  };

  const handleBorrowedTokenSelection = (tokenId: string) => {
    setSelectedBorrowedTokenId(tokenId);
  };

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

  const renderTable = (
    assetsType: keyof typeof assets,
    handleTokenSelection: (tokenId: string) => void,
    selectedTokenId: string
  ) => {
    return (
      <div className="mb-4 my-4 modalBox overflow-auto w-full p-4 bg-dark-250 rounded-2xl">
        <div className="text-white font-bold text-base">
          {assets[assetsType].type}
        </div>
        <table className="modalTable">
          <thead>
            <tr>
              <th>Asset</th>
              <th>tokenBalance</th>
              <th>value</th>
              <th>adjustedValue</th>
              <th>shares</th>
              <th>balance</th>
            </tr>
          </thead>
          <tbody>
            {assets[assetsType].assets.map((asset) => {
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
                          name={assetsType}
                          value={asset.tokenId}
                          checked={selectedTokenId === asset.tokenId}
                          onChange={() => handleTokenSelection(asset.tokenId)}
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
                    {/* {toReadableNumber(meta?.decimals || 0, asset.tokenBalance)} */}
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
  // const handleConfirmSelection = async () => {
  //   const numericRepayRatio = parseFloat(repayRatio);
  //   const result = await calcByRepayRatio(
  //     position,
  //     accountId,
  //     selectedCollateralTokenId,
  //     selectedBorrowedTokenId,
  //     numericRepayRatio
  //   );
  //   if (result.error) {
  //     console.error("发生错误：", result.error);
  //   } else {
  //     console.log("接口返回的数据：", result);
  //   }
  // };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
          overlay: {
            overflow: "auto",
          },
          content: {
            outline: "none",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div
          style={{ maxWidth: "80vw", maxHeight: "80vh" }}
          className="border border-dark-350 border-opacity-20 bg-dark-200 rounded-2xl px-5 py-4 overflow-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-white font-bold text-lg">view details</span>
            <CloseIcon onClick={onRequestClose} className="cursor-pointer" />
          </div>
          <div>
            {renderTable(
              "Collateral",
              handleCollateralTokenSelection,
              selectedCollateralTokenId
            )}
            {renderTable(
              "Borrowed",
              handleBorrowedTokenSelection,
              selectedBorrowedTokenId
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center p-4">
              <p className="text-white text-base mr-2">repayRatio:</p>
              <input
                type="number"
                value={repayRatio}
                onChange={handleRepayRatioChange}
                className="input-style"
              />
            </div>
            {/* <button className="calc-btn" onClick={handleConfirmSelection}>
              Calc By Repay Ratio
            </button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
}
