"use client";

import React, { useState } from 'react';
import styles from './SnowChart.module.css';

const defaultData = [
  { label: 'Jan', value: 20000000 },
  { label: 'Feb', value: 25000000 },
  { label: 'Mar', value: 21000000 },
  { label: 'Apr', value: 28000000 },
  { label: 'May', value: 18000000 },
  { label: 'Jun', value: 25000000 },
];

const SnowChart = ({ data = defaultData }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Constants
  const MAX_VALUE = 30000000; // 30M
  const CHART_HEIGHT = 140; // The height of the drawing area (excluding labels)

  const formatValue = (val) => {
    if (val >= 1000000) return `${val / 1000000}M`;
    return val;
  };

  return (
    <div className={styles.container}>
      {/* --- Left Column: Y-Axis Labels --- */}
      <div className={styles.yAxisColumn}>
        {/* We reverse the array to map Top-to-Bottom (30M -> 0) */}
        {[30, 20, 10, 0].map((val, i) => (
          <div key={val} className={styles.yAxisLabel}>
            {val === 0 ? '0' : `${val}M`}
          </div>
        ))}
      </div>

      {/* --- Right Column: Chart & X-Axis Labels --- */}
      <div className={styles.chartContent}>
        
        {/* 1. The Grid & Bars Area */}
        <div className={styles.gridArea}>
          
          {/* Background Grid Lines */}
          <div className={styles.gridLinesContainer}>
            <div className={styles.gridLine} /> {/* 30M Line */}
            <div className={styles.gridLine} /> {/* 20M Line */}
            <div className={styles.gridLine} /> {/* 10M Line */}
            <div className={`${styles.gridLine} ${styles.baseLine}`} /> {/* 0 Line */}
          </div>

          {/* Bars Layer (Overlays the grid) */}
          <div className={styles.barsContainer}>
            {data.map((item, index) => {
              const heightPercentage = Math.min((item.value / MAX_VALUE), 1);
              const pixelHeight = heightPercentage * CHART_HEIGHT;
              const isHovered = hoveredIndex === index;

              return (
                <div 
                  key={index} 
                  className={styles.barWrapper}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className={styles.tooltip}>{formatValue(item.value)}</div>
                  )}

                  {/* The Bar */}
                  <div 
                    className={styles.barGraphic}
                    style={{
                        height: `${pixelHeight}px`,
                        transform: isHovered ? 'scaleY(1.02) scaleX(1.02)' : 'scale(1)',
                    }}
                  >
                    {/* Light Top Section */}
                    <div className={styles.barTop} />
                    {/* Darker Bottom Section */}
                    <div className={styles.barBottom} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. The X-Axis Labels Area (Month Names) */}
        <div className={styles.xAxisRow}>
          {data.map((item, i) => (
            <div key={i} className={styles.xAxisLabel}>
              {item.label}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SnowChart;
