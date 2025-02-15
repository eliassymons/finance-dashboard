"use client";

import { Box, Card, CardContent, Typography, Paper } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  AttachMoney,
  Padding,
  Savings,
  SavingsTwoTone,
} from "@mui/icons-material";
import { TooltipItem } from "chart.js";

interface DashboardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  chartData: any;
  barData: any;
  lineData: any;
}

const pluginDefaults: any = {
  legend: {
    position: "bottom",
    onHover: handleHover,
    onLeave: handleLeave,
  },
  tooltip: {
    callbacks: {
      label: function (tooltipItem: TooltipItem<any>) {
        let value = Number(tooltipItem.raw) || 0;
        return `$${value.toLocaleString()}`; // 🔹 Adds "$" and formats to 2 decimal places
      },
    },
  },
};
function handleHover(evt: Event, item: any, legend: any) {
  legend.chart.data.datasets[0].backgroundColor.forEach(
    (color: string, index: number, colors: string[]) => {
      colors[index] =
        index === item.index || color.length === 9 ? color : color + "4D";
    }
  );
  legend.chart.update();
}
function handleLeave(evt: Event, item: any, legend: any) {
  legend.chart.data.datasets[0].backgroundColor.forEach(
    (color: string, index: number, colors: string[]) => {
      colors[index] = color.length === 9 ? color.slice(0, -2) : color;
    }
  );
  legend.chart.update();
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
      {" "}
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
              {" "}
              <TrendingUpIcon color="success" sx={{ fontSize: 48 }} />
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
              {" "}
              <TrendingDownIcon color="error" sx={{ fontSize: 48 }} />
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
              {/* 📄 Text Content */}{" "}
              <AttachMoney color="primary" sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">Balance</Typography>
                <Typography fontSize={40} fontWeight={"700"} variant="body1">
                  ${totalBalance.toLocaleString()}
                </Typography>
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
            datatype="currency"
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              plugins: pluginDefaults,
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
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: pluginDefaults,
              }}
            />
          </Paper>

          <Paper
            sx={{ p: 2, maxHeight: "242px", paddingBottom: "3rem" }}
            variant="outlined"
          >
            <Typography variant="h6">Spending Over Time</Typography>
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: pluginDefaults,
              }}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
}
