import React from "react";
import dynamic from "next/dynamic";
const LiquidationComponent = dynamic(
  () => import("../components/Liquidation"),
  {
    ssr: false,
  }
);

export default function LiquidationIndex() {
  return <LiquidationComponent />;
}
