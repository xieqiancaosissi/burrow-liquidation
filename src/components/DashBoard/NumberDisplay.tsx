import React from "react";

interface Props {
  label: string;
  value: number;
}

export default function NumberDisplay({ label, value }: Props) {
  return (
    <div className="bg-gray-700 p-3 rounded">
      <div className="text-sm text-gray-300">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
