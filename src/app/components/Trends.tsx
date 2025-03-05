"use client";

import { Container, Typography, Paper, Box } from "@mui/material";

import { useFinance } from "../context/FinanceContext";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Loading from "./Loading";
import dynamic from "next/dynamic";

const LineChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Line),
  {
    ssr: false,
  }
);

const USMap = dynamic(() => import("./USMap"), { ssr: false });

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

export default function Trends() {
  const { costOfLivingData, costOfLivingByState, isLoading } = useFinance();

  const costOfLivingChartData = {
    labels: costOfLivingData.map((entry) => entry.year),
    datasets: [
      {
        label: "Cost of Living Index",
        data: costOfLivingData.map((entry) => entry.index),
        borderColor: "#D32F2F",
        backgroundColor: "rgba(211, 47, 47, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const costOfLivingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { title: { display: true, text: "Year" } },
      y: { title: { display: true, text: "Cost of Living Index" } },
    },
  };

  return (
    <Container sx={{ py: 3, maxWidth: "1200px" }}>
      <Typography textAlign="center" fontSize={32} variant="h2" gutterBottom>
        Cost of Living Trends
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* COL map */}
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "1 1 400px",
            minWidth: "300px",
          }}
          variant="outlined"
        >
          <Typography variant="h6" gutterBottom>
            Cost of Living Across the U.S.
          </Typography>
          <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }}>
            {isLoading ? (
              <Loading name="Cost of Living Across the U.S." />
            ) : (
              <USMap costOfLivingData={costOfLivingByState} />
            )}
          </Box>
        </Paper>

        {/* COL over time */}
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "1 1 400px",
          }}
          variant="outlined"
        >
          <Typography variant="h6" gutterBottom>
            Cost of Living Over Time
          </Typography>
          <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }}>
            {isLoading ? (
              <Loading name="Cost of Living Over Time" />
            ) : (
              <LineChart
                data={costOfLivingChartData}
                options={costOfLivingChartOptions}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
