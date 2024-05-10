import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { CloseIcon, NEAR_META_DATA } from "./Icons";
import { IAsset } from "../interface/common";
import { toReadableNumber } from "../utils/number";

export default function AssetModal(props: any) {
  const { isOpen, onRequestClose, assets, assetType, allTokenMetadatas } =
    props;
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
          style={{ maxWidth: "58vw" }}
          className="border border-dark-350 border-opacity-20 bg-dark-400 rounded-2xl px-5 py-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-base">{assetType}</span>
            <CloseIcon onClick={onRequestClose} className="cursor-pointer" />
          </div>
          <div
            className="w-full overflow-auto my-4 pb-5 modalBox"
            style={{ maxHeight: "60vh", minHeight: "100px" }}
          >
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
                {assets.map((asset: IAsset) => {
                  let meta = allTokenMetadatas?.[asset.tokenId] || {};
                  if (asset.tokenId == "wrap.near") {
                    meta = NEAR_META_DATA;
                  }
                  return (
                    <tr key={asset.tokenId}>
                      <td>
                        <div className="flex items-center gap-2 mr-10">
                          <img
                            className="flex-shrink-0 w-5 h-5 rounded-full"
                            src={meta?.icon}
                          />
                          <span>{meta?.symbol}</span>
                        </div>
                      </td>
                      <td>
                        {toReadableNumber(
                          meta?.decimals || 0,
                          asset.tokenBalance
                        )}
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
        </div>
      </Modal>
    </div>
  );
}
