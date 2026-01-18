"use client";

import React, { useMemo, useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import SidebarRight from "./SidebarRight";
import Topbar from "./Topbar";
import { ThemeProvider } from "../theme/ThemeProvider";
import { RIGHTBAR_WIDTH, SIDEBAR_WIDTH, TOPBAR_HEIGHT } from "./layoutConstants";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsLeftOpen(false);
        setIsRightOpen(false);
      } else {
        setIsLeftOpen(true);
        setIsRightOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftOffset = isMobile ? 0 : (isLeftOpen ? SIDEBAR_WIDTH : 0);
  const rightOffset = isMobile ? 0 : (isRightOpen ? RIGHTBAR_WIDTH : 0);
  const topbarHeight = isMobile ? 52 : TOPBAR_HEIGHT;

  const contentStyle = useMemo(
    () =>
      ({
        paddingLeft: leftOffset,
        paddingTop: topbarHeight,
        paddingRight: rightOffset,
        // Used by the center dashboard absolute positioning.
        "--sidebar-width": `${SIDEBAR_WIDTH}px`,
        "--topbar-height": `${topbarHeight}px`,
      }) as React.CSSProperties,
    [leftOffset, rightOffset, topbarHeight]
  );

  return (
    <ThemeProvider>
      <Sidebar collapsed={!isLeftOpen} />
      <Topbar
        leftOffset={leftOffset}
        rightOffset={rightOffset}
        height={topbarHeight}
        onToggleLeftSidebar={() => setIsLeftOpen((v) => !v)}
        onToggleRightSidebar={() => setIsRightOpen((v) => !v)}
      />
      <SidebarRight collapsed={!isRightOpen} />
      <div className={styles.content} style={contentStyle}>
        {children}
      </div>
    </ThemeProvider>
  );
}
