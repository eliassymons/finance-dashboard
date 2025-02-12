"use client";

import Dashboard from "../components/Dashboard";
import { useFinance } from "../context/FinanceContext";
import { Transaction } from "../types/transaction";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);
export default function DashboardPage() {
  const {
    transactions,
    totalIncome,
    totalExpenses,
    totalBalance,
    categoryTotals,
  } = useFinance();

  // 🔹 Sort category totals for the pie chart
  const sortedCategoryEntries = Object.entries(categoryTotals).sort(
    (a: any, b: any) => b[1] - a[1]
  );

  // 🔹 Pie Chart Data
  const chartData = {
    labels: sortedCategoryEntries.map(
      ([category]) => category.charAt(0).toUpperCase() + category.slice(1)
    ),
    datasets: [
      {
        data: sortedCategoryEntries.map(([_, amount]) => amount),
        hoverOffset: 4,
        spacing: 2,
        hoverBorderColor: "transparent",
        backgroundColor: [
          "#FF6961",
          "#457B9D",
          "#F4A261",
          "#2A9D8F",
          "#9B5DE5",
          "#FDCB58",
          "#264653",
          "#A8DADC",
        ],
      },
    ],
  };

  // 🔹 Spending Over Time (Line Chart)
  const aggregatedData = transactions.reduce(
    (acc: Record<string, number>, tx: Transaction) => {
      const dateLabel = new Date(tx.date).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
      acc[dateLabel] = (acc[dateLabel] || 0) + Math.abs(tx.amount);
      return acc;
    },
    {}
  );

  const lineData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Spending Over Time",
        data: Object.values(aggregatedData),
        borderColor: "#264653",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#264653",
      },
    ],
  };

  // 🔹 Monthly Spending (Bar Chart)
  const barData = {
    labels: Object.keys(
      transactions.reduce((acc: Record<string, number>, tx: Transaction) => {
        const month = new Date(tx.date).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + Math.abs(tx.amount);
        return acc;
      }, {})
    ),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(
          transactions.reduce(
            (acc: Record<string, number>, tx: Transaction) => {
              const month = new Date(tx.date).toLocaleString("default", {
                month: "short",
                year: "numeric",
              });
              acc[month] = (acc[month] || 0) + Math.abs(tx.amount);
              return acc;
            },
            {}
          )
        ),
        backgroundColor: "#F4A261",
      },
    ],
  };

  return (
    <Dashboard
      totalBalance={totalBalance}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
      chartData={chartData}
      barData={barData}
      lineData={lineData}
    />
  );
}
