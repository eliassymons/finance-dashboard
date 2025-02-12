"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Paper, CircularProgress } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { useFinance } from "../context/FinanceContext";
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

export default function Trends() {
  const { categoryTotals } = useFinance(); // Get user's spending by category
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<any>(null);
  const [spendingComparison, setSpendingComparison] = useState<any>(null);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        // Simulated API delay
        setTimeout(() => {
          setMarketData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Stock Market Index",
                data: [3200, 3300, 3100, 3450, 3550, 3650], // Fake data
                borderColor: "#457B9D",
                backgroundColor: "rgba(69, 123, 157, 0.2)",
                fill: true,
                tension: 0.3,
              },
            ],
          });

          // Fake national average spending data
          const nationalAverages = {
            Food: 500,
            Housing: 1200,
            Transport: 300,
            Entertainment: 250,
            Utilities: 200,
            Fitness: 23,
          };

          setSpendingComparison({
            labels: Object.keys(nationalAverages), // Categories
            datasets: [
              {
                label: "Your Spending ($)",
                data: Object.keys(nationalAverages).map(
                  (category) => categoryTotals[category.toLowerCase()] || 0
                ),
                backgroundColor: "rgba(54, 162, 235, 0.6)", // User spending
              },
              {
                label: "National Average ($)",
                data: Object.values(nationalAverages), // National data
                backgroundColor: "rgba(255, 99, 132, 0.6)", // National benchmark
              },
            ],
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching market data", error);
        setLoading(false);
      }
    }

    fetchMarketData();
  }, [categoryTotals]);

  return (
    <Container sx={{ padding: 2 }}>
      <Typography fontSize={32} variant="h2" gutterBottom>
        Market Trends
      </Typography>

      {/* 📊 Stock Market Trends */}
      <Paper sx={{ p: 3, mt: 2 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Stock Market Overview
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Line
            style={{ maxHeight: "240px" }}
            data={marketData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
            }}
          />
        )}
      </Paper>

      {/* 📉 User Spending vs. National Averages */}
      <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Your Spending vs. National Averages
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Bar
            style={{ maxHeight: "240px" }}
            data={spendingComparison}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        )}
      </Paper>
    </Container>
  );
}
