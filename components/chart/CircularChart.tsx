"use client";

import React, { useMemo, useState, useId } from "react";

type DonutSegment = {
  value: number
  color: string
  label?: string
}

type DonutChartProps = {
  data: DonutSegment[]
  size?: number
  strokeWidth?: number
  className?: string
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 160,
  strokeWidth = 18,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartId = useId();

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  const segments = useMemo(() => {
    const safeTotal = total <= 0 ? 1 : total;
    // Visual spacing between segments.
    // With one end concave and one round, the visual gap equals the geometric gap.
    const gap = 6;

    let offset = 0;

    return data.map((segment, index) => {
      const fraction = Math.max(0, segment.value) / safeTotal;
      const rawDash = fraction * circumference;
      const dash = Math.max(0, rawDash - gap);
      const dashArray = `${dash} ${circumference}`;

      const start = -offset;
      const mid = start + rawDash / 2;
      const midAngle = (mid / circumference) * Math.PI * 2 - Math.PI / 2;

      // Center the gap so each segment has half-gap on each side.
      const dashOffset = offset - gap / 2;
      offset -= rawDash;

      // Calculate the start point for the concave mask (Tail of the segment)
      const startLength = -dashOffset;
      const startAngle = (startLength / circumference) * 2 * Math.PI;

      const maskX = center + radius * Math.cos(startAngle);
      const maskY = center + radius * Math.sin(startAngle);

      return {
        dashArray,
        dashOffset,
        midAngle,
        value: segment.value,
        color: segment.color,
        label: segment.label,
        maskId: `mask-${chartId}-${index}`,
        maskX,
        maskY,
      };
    });
  }, [circumference, data, strokeWidth, total, center, radius, chartId]);

  const tooltip = useMemo(() => {
    if (hoveredIndex === null) return null;
    const seg = segments[hoveredIndex];
    if (!seg) return null;
    const percent = total > 0 ? (seg.value / total) * 100 : 0;
    const label = `${percent.toFixed(1)}%`;

    // Place tooltip slightly outside the ring along the segment mid-angle.
    const r = radius + strokeWidth / 2 + 10;
    const rawX = center + r * Math.cos(seg.midAngle);
    const y = center + r * Math.sin(seg.midAngle);
    // Mirror the X coordinate for anti-clockwise rendering
    const x = size - rawX;

    return { x, y, label };
  }, [center, hoveredIndex, radius, segments, strokeWidth, total]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Donut chart">
        <defs>
          {segments.map((seg, index) => {
            const isHovered = index === hoveredIndex;
            const sWidth = isHovered ? strokeWidth + 1.5 : strokeWidth;
            return (
              <mask id={seg.maskId} key={seg.maskId} maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width={size} height={size} fill="white" />
                <circle cx={seg.maskX} cy={seg.maskY} r={sWidth / 2} fill="black" />
              </mask>
            );
          })}
        </defs>
        <g transform={`translate(${size}, 0) scale(-1, 1) rotate(-90 ${center} ${center})`}>
          {segments.map((seg, index) => {
            const isHovered = index === hoveredIndex;
            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 1.5 : strokeWidth}
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="round"
                mask={`url(#${seg.maskId})`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transition: "stroke-width 140ms ease, opacity 140ms ease",
                  opacity: hoveredIndex === null || isHovered ? 1 : 0.8,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </g>
      </svg>

      {tooltip ? (
        <div
          role="status"
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -110%)",
            padding: "6px 8px",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: "18px",
            fontWeight: 600,
            color: "var(--cd-text)",
            background: "color-mix(in srgb, var(--cd-surface) 92%, transparent)",
            border: "1px solid var(--cd-divider)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.label}
        </div>
      ) : null}
    </div>
  );
}

export default DonutChart
