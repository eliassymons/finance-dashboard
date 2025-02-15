"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Paper, CircularProgress } from "@mui/material";
import { Line, Bubble } from "react-chartjs-2";
import { useFinance } from "../context/FinanceContext";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BubbleController,
  TimeScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BubbleController,
  TimeScale
);

ChartJS.defaults.font.family = "Roboto";

// ✅ API URLs
const API_COST_OF_LIVING = process.env.NEXT_PUBLIC_API_COST_OF_LIVING as string;
const API_TRANSACTIONS = process.env.NEXT_PUBLIC_API_TRANSACTIONS as string;

export default function Trends() {
  const [loading, setLoading] = useState(true);
  const [costOfLivingData, setCostOfLivingData] = useState<any>(null);
  const [spendingData, setSpendingData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Fetch Cost of Living Data
        const colResponse = await fetch(API_COST_OF_LIVING);
        if (!colResponse.ok)
          throw new Error("Failed to fetch cost of living data");
        const colData = await colResponse.json();

        // ✅ Fetch Transactions for Spending Data
        const txResponse = await fetch(API_TRANSACTIONS);
        if (!txResponse.ok) throw new Error("Failed to fetch transactions");
        const txData = await txResponse.json();

        // ✅ Transform Cost of Living Data (Line Chart)
        setCostOfLivingData({
          labels: colData.map((entry: any) => entry.year),
          datasets: [
            {
              label: "Cost of Living Index",
              data: colData.map((entry: any) => entry.index),
              borderColor: "#D32F2F",
              backgroundColor: "rgba(211, 47, 47, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        });

        // ✅ Transform Transactions Data (Bubble Chart)
        setSpendingData({
          datasets: txData.map((tx: any) => ({
            label: tx.category,
            data: [
              {
                x: new Date(tx.date).getTime(), // ✅ X-axis: Date as timestamp
                y: tx.amount, // ✅ Y-axis: Amount spent
                r: Math.min(Math.abs(tx.amount) / 50 + 3, 15), // ✅ Capped at max size of 15
              },
            ],
            backgroundColor: "rgba(54, 162, 235, 0.6)", // ✅ Consistent color
          })),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Container sx={{ padding: 2 }}>
      <Typography textAlign={"center"} fontSize={32} variant="h2" gutterBottom>
        Spending Trends & Cost of Living
      </Typography>

      {/* 📊 Cost of Living Trends */}
      <Paper sx={{ p: 3, mt: 2 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Cost of Living Over Time
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Line
            style={{ maxHeight: "240px" }}
            data={costOfLivingData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
            }}
          />
        )}
      </Paper>

      {/* 🔥 Spending Trends (Bubble Chart) */}
      <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Spending Over Time
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Bubble
            style={{ maxHeight: "300px" }}
            data={spendingData}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "month",
                  },
                  title: {
                    display: true,
                    text: "Time (Months)",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Amount Spent ($)",
                  },
                },
              },
              plugins: {
                legend: { display: true },
              },
            }}
          />
        )}
      </Paper>
    </Container>
  );
}
