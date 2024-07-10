export default function getConfig(
  env: string | undefined = process.env.NEXT_PUBLIC_NEAR_ENV
) {
  switch (env) {
    case "pub-testnet":
      return {
        LIQUIDATION_API_URL: "https://public-testnet.liquidation.burrow.fun",
        NODE_URL: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.near.org",
        myNearWalletUrl: "https://app.mynearwallet.com/",
        helperUrl: "https://api.kitwallet.app",
        explorerUrl: "https://nearblocks.io",
      };
    case "testnet":
      return {
        LIQUIDATION_API_URL: "https://public-testnet.liquidation.burrow.fun",
        NODE_URL: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        myNearWalletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://testnet-api.kitwallet.app",
        explorerUrl: "https://testnet.nearblocks.io",
      };
    default:
      return {
        LIQUIDATION_API_URL: "https://api.liquidation.burrow.finance",
        NODE_URL: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        myNearWalletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://testnet-api.kitwallet.app",
        explorerUrl: "https://testnet.nearblocks.io",
      };
  }
}
export const LP_ASSET_MARK = "shadow_ref_v1";