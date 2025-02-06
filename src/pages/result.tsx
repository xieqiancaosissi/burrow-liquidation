import React from "react";
import dynamic from "next/dynamic";
const ResultComponent = dynamic(() => import("../components/Result"), {
  ssr: false,
});

export default function Result() {
  return <ResultComponent />;
}
