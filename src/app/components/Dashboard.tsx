"use client";

import { Box, Card, CardContent, Typography, Paper } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { AttachMoney, Savings, SavingsTwoTone } from "@mui/icons-material";

interface DashboardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  chartData: any;
  barData: any;
  lineData: any;
}

export default function Dashboard({
  totalBalance,
  totalIncome,
  totalExpenses,
  chartData,
  barData,
  lineData,
}: DashboardProps) {
  return (
    <>
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
              {" "}
              <TrendingUpIcon color="success" sx={{ fontSize: 48 }} />
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6">Income</Typography>
                <Typography variant="h4">${totalIncome.toFixed(2)}</Typography>
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
              {" "}
              <TrendingDownIcon color="error" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Expenses</Typography>
                <Typography variant="h4" color="error">
                  ${Math.abs(totalExpenses).toFixed(2)}
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
              {/* 📄 Text Content */}{" "}
              <AttachMoney color="primary" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Remaining Balance</Typography>
                <Typography variant="h4">${totalBalance.toFixed(2)}</Typography>
              </Box>
              {/* 🔹 Icon */}
            </Box>
          </CardContent>
        </Card>
        {/* 💰 Savings  Rate */}
        <Card sx={{ flex: "1 1 200px" }} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              textAlign="right"
            >
              {" "}
              <Savings color="primary" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Savings Rate</Typography>
                <Typography variant="h4">
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
        {/* 🥧 Pie Chart */}
        <Paper
          sx={{
            p: 2,
            maxHeight: "500px",
            paddingBottom: "4rem",
            flex: "1 1 400px",
          }}
          variant="outlined"
        >
          <Typography variant="h6">Expense Breakdown</Typography>
          <Doughnut
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
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
            sx={{ p: 2, maxHeight: "242px", paddingBottom: "4rem" }}
            variant="outlined"
          >
            <Typography variant="h6">Monthly Spending Trends</Typography>
            <Bar
              data={barData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Paper>

          <Paper
            sx={{ p: 2, maxHeight: "242px", paddingBottom: "4rem" }}
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
