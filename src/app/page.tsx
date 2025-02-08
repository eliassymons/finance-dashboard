"use client";

import { useState } from "react";
import { useFinance } from "./context/FinanceContext";

import Budget from "./components/Budget";
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
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";

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

export default function Home() {
  const {
    transactions,
    addTransaction,
    categoryBudgets,
    setCategoryBudgets,
    totalIncome,
    totalExpenses,
    totalBalance,
    categoryTotals,
  } = useFinance();

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
  });

  const [activeTab, setActiveTab] = useState(0); // ✅ Use index for Material Tabs

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const sortedCategoryEntries = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  ); // Sort by value descending

  const chartData = {
    labels: sortedCategoryEntries.map(([category]) => category),
    datasets: [
      {
        data: sortedCategoryEntries.map(([_, amount]) => amount),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
      },
    ],
  };
  const aggregatedData = transactions.reduce(
    (acc: Record<string, number>, tx) => {
      const dateLabel = new Date(tx.date).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });

      acc[dateLabel] = (acc[dateLabel] || 0) + Math.abs(tx.amount); // Aggregate spending per date
      return acc;
    },
    {}
  );

  const lineData = {
    labels: Object.keys(aggregatedData), // Unique, sorted dates
    datasets: [
      {
        label: "Spending Over Time",
        data: Object.values(aggregatedData), // Corresponding aggregated values
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Light fill under the line
        fill: true, // ✅ Fills the area under the line
        tension: 0.3, // ✅ Smooth curve effect
        pointRadius: 4, // ✅ Visible data points
        pointBackgroundColor: "#36a2eb",
      },
    ],
  };
  const barData = {
    labels: Object.keys(
      transactions.reduce((acc: Record<string, number>, tx) => {
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
          transactions.reduce((acc: Record<string, number>, tx) => {
            const month = new Date(tx.date).toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            acc[month] = (acc[month] || 0) + Math.abs(tx.amount);
            return acc;
          }, {})
        ),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Personal Finance Dashboard
      </Typography>

      {/* ✅ Material UI Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Dashboard" />
          <Tab label="Transactions" />
          <Tab label="Budget" />
        </Tabs>
      </Box>

      {/* ✅ Conditionally Render Components Based on Active Tab */}
      {activeTab === 0 && (
        <Dashboard
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          chartData={chartData}
          barData={barData}
          lineData={lineData}
        />
      )}
      {activeTab === 1 && (
        <Transactions
          transactions={transactions}
          addTransaction={addTransaction}
        />
      )}
      {activeTab === 2 && (
        <Budget
          categoryBudgets={categoryBudgets}
          setCategoryBudgets={setCategoryBudgets}
          totalExpenses={categoryTotals}
        />
      )}
    </Container>
  );
}
