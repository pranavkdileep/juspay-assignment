import CenterDashboard from "../components/center/CenterDashboard";
import type { CSSProperties } from "react";

export default function Home() {
  return (
    <div
      style={
        {
          position: "relative",
          minHeight: "1100px",
          background: "var(--background)",
        } as CSSProperties
      }
    >
      <CenterDashboard />
    </div>
  );
}
