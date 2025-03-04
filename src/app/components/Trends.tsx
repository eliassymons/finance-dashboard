"use client";

import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { Line } from "react-chartjs-2";
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
import USMap from "./USMap";
import Loading from "./Loading";

// ✅ Register Chart.js components
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

  // ✅ Transform Cost of Living Data (Line Chart)
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

      {/* ✅ Switch Back to `flexbox` */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // ✅ Column on mobile, row on larger screens
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* ✅ Cost of Living Map (Shrinks More Evenly) */}
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "1 1 400px", // ✅ Allows the map to shrink but not disappear
            minWidth: "300px", // ✅ Prevents it from shrinking too much
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

        {/* ✅ Cost of Living Over Time (Now Shrinks Better) */}
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "1 1 400px", // ✅ Takes more space but still shrinks
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
              <Line
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
