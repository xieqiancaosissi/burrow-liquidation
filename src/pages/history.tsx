import React from "react";
import dynamic from "next/dynamic";
const HistoryComponent = dynamic(() => import("../components/History"), {
  ssr: false,
});

export default function LiquidationIndex() {
  return <HistoryComponent />;
}
