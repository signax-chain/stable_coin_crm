import React, { useState } from "react";

import styles from "../../styles/dashboard.module.css";
import { Bitcoin, Coins, Landmark } from "lucide-react";
import { LineChart } from "@mui/x-charts";

export default function DashboardComponent() {
  const [stats, setStats] = useState([
    {
      title: "Available Tokens",
      subtitle: "10 tokens",
      icon: <Coins color="white" size={70} strokeWidth="1.5px" />,
    },
    {
      title: "Total Token Supply",
      subtitle: "$10,0000",
      icon: <Bitcoin color="white" size={70} strokeWidth="1.5px" />,
    },
    {
      title: "Available Banks",
      subtitle: "20 Commercial Bank",
      icon: <Landmark color="white" size={70} strokeWidth="1.5px" />,
    },
  ]);

  return (
    <div className={styles["dashboard-container"]}>
      <h1 className={styles["dashboard-title"]}>Central Bank Dashboard</h1>
      <div className={styles["dashboard__stats"]}>
        <div className={styles["dashboard__basic_stats"]}>
          {stats.map((stat, index) => {
            return (
              <div className={styles["dashboard__stat"]} key={index}>
                <div className={styles["dashboard__icon"]}>{stat.icon}</div>
                <div className={styles["dashboard__stats_data"]}>
                  <h3 className={styles["dashboard__stats_title"]}>
                    {stat.title}
                  </h3>
                  <h4 className={styles["dashboard__stats_subtitle"]}>
                    {stat.subtitle}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles["dashboard-chart"]}>
        <h3>Transactions Per Week</h3>
        <LineChart
          className={styles["line-chart"]}
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 3, 4, 6.5, 3, 5],
              area: true,
            },
          ]}
          width={1000}
          height={300}
        />
      </div>
    </div>
  );
}
