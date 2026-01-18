import Image from "next/image";
import React from "react";
import { Inter } from "next/font/google";
import styles from "./CenterDashboard.module.css";
import DonutChart from "../chart/CircularChart";
import SnowChart from "../chart/SnowChart";
import RevenueChart from "../chart/RevenueChart";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  const rotation = direction === "up" ? "rotate(0deg)" : "rotate(180deg)";
  return (
    <svg
      className={styles.arrow}
      style={{ transform: rotation }}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 3L13 8H10V13H6V8H3L8 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Stat = {
  title: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  variant: "blue" | "surface" | "growth";
};

const stats: Stat[] = [
  {
    title: "Customers",
    value: "3,781",
    delta: "+11.01%",
    direction: "up",
    variant: "blue",
  },
  {
    title: "Orders",
    value: "1,219",
    delta: "-0.03%",
    direction: "down",
    variant: "surface",
  },
  {
    title: "Revenue",
    value: "$695",
    delta: "+15.03%",
    direction: "up",
    variant: "surface",
  },
  {
    title: "Growth",
    value: "30.1%",
    delta: "+6.08%",
    direction: "up",
    variant: "growth",
  },
];

const locations = [
  { name: "New York", value: "72K", width: 114 },
  { name: "San Francisco", value: "39K", width: 64 },
  { name: "Sydney", value: "25K", width: 74 },
  { name: "Singapore", value: "61K", width: 94 },
];

const products = [
  { name: "ASOS Ridley High Waist", price: "$79.49", qty: "82", amount: "$6,518.18" },
  { name: "Marco Lightweight Shirt", price: "$128.50", qty: "37", amount: "$4,754.50" },
  { name: "Half Sleeve  Shirt", price: "$39.99", qty: "64", amount: "$2,559.36" },
  { name: "Lightweight Jacket", price: "$20.00", qty: "184", amount: "$3,680.00" },
  { name: "Marco Shoes", price: "$79.49", qty: "64", amount: "$1,965.81" },
];

const sales = [
  { label: "Direct", value: "$300.56", dotClass: styles.salesDot },
  { label: "Affiliate", value: "$135.18", dotClass: `${styles.salesDot} ${styles.salesDotGreen}` },
  { label: "Sponsored", value: "$154.02", dotClass: `${styles.salesDot} ${styles.salesDotPurple}` },
  { label: "E-mail", value: "$48.96", dotClass: `${styles.salesDot} ${styles.salesDotBlue}` },
];

const sales_data = [
  { label: "Direct", value: 300.56, color: "var(--cd-sales-direct)" },
  { label: "Affiliate", value: 135.18, color: "var(--cd-sales-affiliate)" },
  { label: "Sponsored", value: 154.02, color: "var(--cd-sales-sponsored)" },
  { label: "E-mail", value: 48.96, color: "var(--cd-sales-email)" },
];

export default function CenterDashboard() {
  return (
    <section className={`${styles.dashboard} ${inter.className}`}>
      <div className={styles.group}>
        {stats.map((s) => (
          <div
            key={s.title}
            className={styles.statCard}
            data-variant={s.variant}
            style={{
              background:
                s.variant === "blue"
                  ? "var(--cd-stat-blue)"
                  : s.variant === "growth"
                    ? "var(--cd-stat-growth)"
                    : "var(--cd-stat-surface)",
            }}
          >
            <div className={styles.statTitleRow}>
              <div className={styles.statTitle}>{s.title}</div>
            </div>
            <div className={styles.statValueRow}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.delta}>
                <span>{s.delta}</span>
                <ArrowIcon direction={s.direction} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.block} ${styles.blockSmall}`}>
        <div className={styles.blockTitle}>Projections vs Actuals</div>
        {/* <div className={`${styles.placeholder} ${styles.placeholderSmallChart}`} /> */}
        <SnowChart />
      </div>

      <div className={`${styles.block} ${styles.blockLarge}`}>
        <div className={styles.headerRow}>
          <div className={styles.blockTitle}>Revenue</div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.dot} />
              <span>Current Week</span>
              <span>$58,211</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.dotMuted} />
              <span>Previous Week</span>
              <span>$68,768</span>
            </div>
          </div>
        </div>
        <RevenueChart />
      </div>

      <div className={`${styles.block} ${styles.blockMap}`}>
        <div className={styles.blockTitle}>Revenue by Location</div>
        <Image
          className={styles.mapImg}
          src="/assests/worldmap.svg"
          alt="World map"
          width={154}
          height={82}
          priority
        />
        <div className={styles.locationList}>
          {locations.map((l) => (
            <div key={l.name} className={styles.locationRow}>
              <div className={styles.locationLine}>
                <span>{l.name}</span>
                <span>{l.value}</span>
              </div>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${l.width}px` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.block} ${styles.blockTable}`}>
        <div className={styles.blockTitle}>Top Selling Products</div>
        <div className={styles.table}>
          <div className={styles.cellHeader} style={{ paddingLeft: 0 }}>
            Name
          </div>
          <div className={styles.cellHeader}>Price</div>
          <div className={styles.cellHeader}>Quantity</div>
          <div className={styles.cellHeader}>Amount</div>

          {products.map((p, idx) => (
            <React.Fragment key={`${p.name}-${idx}`}>
              <div
                key={`${p.name}-name`}
                className={`${styles.cell} ${idx === products.length - 1 ? "" : styles.tableRowDivider}`}
                style={{ paddingLeft: 0 }}
              >
                {p.name}
              </div>
              <div
                key={`${p.name}-price`}
                className={`${styles.cell} ${idx === products.length - 1 ? "" : styles.tableRowDivider}`}
              >
                {p.price}
              </div>
              <div
                key={`${p.name}-qty`}
                className={`${styles.cell} ${idx === products.length - 1 ? "" : styles.tableRowDivider}`}
              >
                {p.qty}
              </div>
              <div
                key={`${p.name}-amount`}
                className={`${styles.cell} ${idx === products.length - 1 ? "" : styles.tableRowDivider}`}
              >
                {p.amount}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className={`${styles.block} ${styles.blockSales}`}>
        <div className={styles.blockTitle} style={{ alignSelf: "stretch" }}>
          Total Sales
        </div>
        <DonutChart
          className={styles.salesChart}
          data={sales_data}
          size={120}
          strokeWidth={18}
        />
        <div className={styles.salesLegend}>
          {sales.map((s) => (
            <div key={s.label} className={styles.salesLegendRow}>
              <div className={styles.salesLegendLeft}>
                <span className={s.dotClass} />
                <span>{s.label}</span>
              </div>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
