export interface ILiquidation {
  accountId: string;
  position: string;
  collateralAssets: IAsset[];
  borrowedAssets: IAsset[];
  healthFactor: string;
  collateralSum: string;
  borrowedSum: string;
  gapSum: string;
  adjustedCollateralSum: string;
  adjustedBorrowedSum: string;
  adjustedGapSum: string;
}
export interface IAsset {
  tokenId: string;
  shares: string;
  balance: string;
  tokenBalance: string;
  value: string;
  adjustedValue: string;
}
export interface IAssetsByType {
  Collateral: {
    type: string;
    assets: IAsset[];
  };
  Borrowed: {
    type: string;
    assets: IAsset[];
  };
  accountId: string;
  position: string;
}
export type IAssetType = "Collateral" | "Borrowed" | "";

export interface TokenMetadata {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
}

export type ISortkey =
  | "collateralSum"
  | "borrowedSum"
  | "gapSum"
  | "adjustedCollateralSum"
  | "adjustedBorrowedSum"
  | "adjustedGapSum"
  | "";
