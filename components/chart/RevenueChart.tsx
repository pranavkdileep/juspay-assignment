"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './RevenueChart.module.css';

interface ChartData {
  label: string;
  revenue: number;
  projection: number;
}

const defaultData: ChartData[] = [
  { label: 'Jan', revenue: 8000000, projection: 14000000 },
  { label: 'Feb', revenue: 18000000, projection: 9000000 },
  { label: 'Mar', revenue: 13000000, projection: 10000000 },
  { label: 'Apr', revenue: 11000000, projection: 16000000 },
  { label: 'May', revenue: 16000000, projection: 20000000 },
  { label: 'Jun', revenue: 24000000, projection: 21000000 },
];

const RevenueChart = ({ data = defaultData }: { data?: ChartData[] }) => {
  const [hoverData, setHoverData] = useState<(ChartData & { x: number }) | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setChartWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Constants from Figma & Image
  const MAX_VAL = 30000000; 
  const HEIGHT = 188; // Total height minus bottom text area
  const PADDING_X = 20;

  // Helper to calculate SVG points
  const getCoordinates = (index: number, value: number) => {
    // Only calculate if we have width
    if (chartWidth === 0) return { x: 0, y: 0 };
    const x = PADDING_X + (index * (chartWidth - PADDING_X * 2)) / (data.length - 1);
    const y = HEIGHT - (value / MAX_VAL) * HEIGHT;
    return { x, y };
  };

  // Generate Smooth Path (Cubic Bezier)
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const line1Points = data.map((d, i) => getCoordinates(i, d.revenue));
  const line2Points = data.map((d, i) => getCoordinates(i, d.projection));

  const handleMouseMove = (e: { clientX: number; }) => {
    if (!containerRef.current || chartWidth === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    
    // Clamp index between 0 and data.length - 1
    const rawIndex = Math.round((x - PADDING_X) / ((chartWidth - PADDING_X * 2) / (data.length - 1)));
    const index = Math.max(0, Math.min(rawIndex, data.length - 1));
    
    // Only update if within reasonable Interaction range if needed
    if (index >= 0 && index < data.length) {
      setHoverData({ ...data[index], x: line1Points[index].x });
    }
  };

  return (
    <div className={styles.chartWrapper}>
      {/* Left Text (Y-Axis) */}
      <div className={styles.leftTextColumn}>
        {['30M', '20M', '10M', '0'].map((label) => (
          <div key={label} className={styles.yAxisLabel}>{label}</div>
        ))}
      </div>

      {/* Frame */}
      <div className={styles.frame} ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
        
        {/* Grid Lines */}
        <div className={styles.lineLayer}>
          <div className={styles.gridLine} />
          <div className={styles.gridLine} />
          <div className={styles.gridLine} />
          <div className={`${styles.gridLine} ${styles.baseLine}`} />
        </div>

        {/* SVG Drawing Layer */}
        {chartWidth > 0 && (
          <svg className={styles.svgLayer} width={chartWidth} height={HEIGHT} viewBox={`0 0 ${chartWidth} ${HEIGHT}`}>
            {/* Blue Line (Revenue) */}
            <path d={createSmoothPath(line1Points)} fill="none" stroke="var(--cd-dot-muted)" strokeWidth="3" />
            
            {/* Black Line - Solid Part (Jan to Apr) */}
            <path d={createSmoothPath(line2Points.slice(0, 4))} fill="none" stroke="var(--cd-text)" strokeWidth="3" />
            
            {/* Black Line - Dashed Part (Apr to Jun) */}
            <path d={createSmoothPath(line2Points.slice(3))} fill="none" stroke="var(--cd-text)" strokeWidth="3" strokeDasharray="6,4" />

            {/* Interaction Vertical Line */}
            {hoverData && (
              <line x1={hoverData.x} y1="0" x2={hoverData.x} y2={HEIGHT} stroke="var(--cd-divider)" strokeWidth="1" />
            )}
            
            {/* Interaction Dot on Line 1 (Revenue) */}
             {hoverData && (
              <circle cx={hoverData.x} cy={getCoordinates(data.indexOf(hoverData), hoverData.revenue).y} r="4" fill="var(--cd-surface)" stroke="var(--cd-text)" strokeWidth="2" />
            )}
             {/* Interaction Dot on Line 2 (Projection) */}
             {hoverData && (
              <circle cx={hoverData.x} cy={getCoordinates(data.indexOf(hoverData), hoverData.projection).y} r="4" fill="var(--cd-surface)" stroke="var(--cd-text)" strokeWidth="2" />
            )}
          </svg>
        )}

        {/* Tooltip interaction */}
        {hoverData && (
          <div 
            className={styles.tooltip} 
            style={{ 
              left: Math.min(Math.max(0, hoverData.x - 50), chartWidth - 100), // Keep tooltip within bounds
              top: 20, 
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{hoverData.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--cd-dot-muted)' }}>
                <span style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--cd-dot-muted)'}}></span>
                <span>Revenue: ${(hoverData.revenue / 1000).toLocaleString()}k</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--cd-text)' }}>
                 <span style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--cd-text)'}}></span>
                <span>Projection: ${(hoverData.projection / 1000).toLocaleString()}k</span>
            </div>
          </div>
        )}

        {/* Bottom Text (X-Axis) */}
        <div className={styles.bottomTextRow}>
          {data.map((item) => (
            <div key={item.label} className={styles.xAxisLabel}>{item.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
