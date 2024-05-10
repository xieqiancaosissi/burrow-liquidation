import React from "react";
import { PacmanLoader } from "react-spinners";

export const BeatLoading = () => {
  return (
    <div className="flex justify-center my-10">
      <div className="w-10 h-10">
        <PacmanLoader color="#36d7b7" />
      </div>
    </div>
  );
};
