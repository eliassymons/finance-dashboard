"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  capitalize,
} from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  AttachMoney,
  Savings,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { useFinance } from "../context/FinanceContext";
import Loading from "../components/Loading";
import { Chart as ChartJS } from "chart.js";

ChartJS.defaults.font.family = "Roboto";

export default function Dashboard() {
  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    categoryTotals,
    transactions,
    isLoading,
    isFetching,
  } = useFinance();

  if (isLoading || isFetching) {
    return <Loading name="Dashboard" />;
  }

  // Doughnut Chart: Expense Breakdown
  const expenseCategories = Object.keys(categoryTotals).map((c) =>
    capitalize(c)
  );
  const expenseAmounts = Object.values(categoryTotals).map((t) =>
    Math.round(t)
  );

  const chartData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expenses",
        data: expenseAmounts,
        backgroundColor: [
          "#FF6B6B", // Muted Coral Red
          "#FF9F1C", // Rich Golden Yellow
          "#FFCC5C", // Warm Amber
          "#4ECDC4", // Soft Teal
          "#5C7AEA", // Vibrant Slate Blue
          "#C06C84", // Deep Rose
        ],

        borderWidth: 1,
      },
    ],
  };

  //  Bar Chart: Monthly Spending Trends
  const monthlyTotals = transactions.reduce((acc, tx) => {
    if (tx.type === "Expense") {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + Math.abs(tx.amount);
    }
    return acc;
  }, {} as { [key: string]: number });

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlyTotals),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  //  Line Chart: Spending Over Time (by Week)
  const weeklyTotals = transactions.reduce((acc, tx) => {
    if (tx.type === "Expense") {
      const weekNumber = Math.ceil(new Date(tx.date).getDate() / 7);
      acc[weekNumber] = (acc[weekNumber] || 0) + Math.abs(tx.amount);
    }
    return acc;
  }, {} as { [key: number]: number });

  const lineData = {
    labels: Object.keys(weeklyTotals).map((week) => `Week ${week}`),
    datasets: [
      {
        label: "Spending Over Time",
        data: Object.values(weeklyTotals),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const savingsRate =
    totalIncome !== 0
      ? (((totalIncome - Math.abs(totalExpenses)) / totalIncome) * 100).toFixed(
          1
        )
      : 0;

  return (
    <>
      <Typography
        textAlign={"center"}
        fontSize={32}
        mt={4}
        variant="h2"
        gutterBottom
      >
        Your Finances, At a Glance
      </Typography>

      {/*  Summary Cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={2}
      >
        <Card sx={{ flex: "1 1 200px", px: 2 }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <TrendingUp color="success" sx={{ fontSize: 48 }} />
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6">Income</Typography>
                <Typography fontSize={40} fontWeight={"700"} variant="body1">
                  ${Math.round(totalIncome).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <TrendingDown color="error" sx={{ fontSize: 48 }} />
              <Box textAlign="right">
                <Typography variant="h6">Expenses</Typography>
                <Typography fontSize={40} fontWeight={"700"} variant="body1">
                  ${Math.round(Math.abs(totalExpenses)).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <AttachMoney color="primary" sx={{ fontSize: 48 }} />
              <Box textAlign="right">
                <Typography variant="h6">Balance</Typography>
                <Typography
                  color={totalBalance > 0 ? "textPrimary" : "error"}
                  fontSize={40}
                  fontWeight={"700"}
                  variant="body1"
                >
                  {totalBalance < 0 && "-"} $
                  {Math.round(Math.abs(totalBalance)).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Savings color="primary" sx={{ fontSize: 48 }} />
              <Box textAlign="right">
                <Typography variant="h6">Savings Rate</Typography>
                <Typography
                  fontSize={40}
                  fontWeight={"700"}
                  variant="body1"
                  color={totalBalance > 0 ? "textPrimary" : "error"}
                >
                  {savingsRate}%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 2,
          alignItems: "start",
          mt: 3,
        }}
      >
        <Paper
          sx={{ p: 2, maxHeight: "500px", flex: "1 1 360px", pb: 6 }}
          variant="outlined"
        >
          <Typography variant="h6">Expense Breakdown</Typography>
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `$${tooltipItem?.raw?.toLocaleString()}`;
                    },
                  },
                },
              },
            }}
          />
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            flex: "1 1 400px",
          }}
        >
          <Paper sx={{ p: 2, maxHeight: "242px", pb: 6 }} variant="outlined">
            <Typography variant="h6">Monthly Spending Trends</Typography>
            <Bar
              data={barData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Paper>

          <Paper sx={{ p: 2, pb: 6, maxHeight: "242px" }} variant="outlined">
            <Typography variant="h6">Spending Over Time</Typography>
            <Line
              data={lineData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
}
