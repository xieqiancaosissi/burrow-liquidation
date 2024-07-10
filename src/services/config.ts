export default function getConfig(
  env: string | undefined = process.env.NEXT_PUBLIC_NEAR_ENV
) {
  switch (env) {
    case "pub-testnet":
      return {
        LIQUIDATION_API_URL: "https://public-testnet.liquidation.burrow.fun",
      };
    case "testnet":
      return {
        LIQUIDATION_API_URL: "https://public-testnet.liquidation.burrow.fun",
      };
    default:
      return {
        LIQUIDATION_API_URL: "https://api.liquidation.burrow.finance",
      };
  }
}