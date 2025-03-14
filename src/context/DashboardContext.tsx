import { createContext, useContext } from "react";

interface DashboardContextType {
  toggleComponent: () => void;
}

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
