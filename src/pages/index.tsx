import React from "react";
import dynamic from "next/dynamic";
const DashBoardComponent = dynamic(() => import("../components/DashBoard"), {
  ssr: false,
});

export default function DashBoard() {
  return <DashBoardComponent />;
}
