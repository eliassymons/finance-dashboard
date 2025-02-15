"use client";

import { Box, Card, CardContent, Typography, Paper } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  AttachMoney,
  Savings,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { useFinance } from "../context/FinanceContext"; // ✅ Import useFinance
import Loading from "../components/Loading"; // ✅ Import Loading component

export default function Dashboard() {
  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    categoryTotals, // ✅ Use for chartData
    isLoading,
    isFetching,
  } = useFinance();

  // ✅ Show loading while data is being fetched
  if (isLoading || isFetching) {
    return <Loading name="Dashboard" />;
  }

  // ✅ Prepare Chart Data (Doughnut)
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#70b04d",
          "#4CAF50",
        ],
        borderWidth: 1,
      },
    ],
  };

  // ✅ Mock Bar & Line Chart Data (Replace with actual transaction history)
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Monthly Spending",
        data: [200, 300, 250, 400, 500],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Spending Over Time",
        data: [150, 220, 180, 300],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

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

      {/* 🔹 Summary Cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={2}
      >
        {/* 📈 Total Income */}
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
                  ${totalIncome.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 📉 Total Expenses */}
        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              textAlign="right"
            >
              <TrendingDown color="error" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Expenses</Typography>
                <Typography fontSize={40} fontWeight={"700"} variant="body1">
                  ${Math.abs(totalExpenses).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 💰 Total Balance */}
        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              textAlign="right"
            >
              <AttachMoney color="primary" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Balance</Typography>
                <Typography fontSize={40} fontWeight={"700"} variant="body1">
                  ${totalBalance.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 💰 Savings Rate */}
        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              textAlign="right"
            >
              <Savings color="primary" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Savings Rate</Typography>
                <Typography fontSize={40} fontWeight={"700"} variant="body1">
                  {(
                    ((totalIncome - Math.abs(totalExpenses)) / totalIncome) *
                    100
                  ).toFixed()}
                  %
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 🔹 Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 2,
          alignItems: "start",
          mt: 3,
        }}
      >
        {/* 🥧 Doughnut Chart */}
        <Paper
          sx={{
            p: 2,
            maxHeight: "500px",
            paddingBottom: "3rem",
            flex: "1 1 400px",
          }}
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

        {/* 📊 Bar & Line Charts */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            maxHeight: "500px",
            flex: "1 1 400px",
          }}
        >
          <Paper
            sx={{ p: 2, maxHeight: "242px", paddingBottom: "3rem" }}
            variant="outlined"
          >
            <Typography variant="h6">Monthly Spending Trends</Typography>
            <Bar
              data={barData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Paper>

          <Paper
            sx={{ p: 2, maxHeight: "242px", paddingBottom: "3rem" }}
            variant="outlined"
          >
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
