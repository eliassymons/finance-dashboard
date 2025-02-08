"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  LinearProgress,
} from "@mui/material";
import {
  DirectionsBus,
  Fastfood,
  Home,
  Movie,
  ShoppingBag,
  FitnessCenter,
  Apartment,
} from "@mui/icons-material";

const DEFAULT_BUDGETS: {
  [key: string]: { amount: number; icon: React.ReactNode };
} = {
  food: { amount: 200, icon: <Fastfood color="primary" /> },
  transport: { amount: 100, icon: <DirectionsBus color="secondary" /> },
  entertainment: { amount: 150, icon: <Movie color="success" /> },
  shopping: { amount: 250, icon: <ShoppingBag color="error" /> },
  utilities: { amount: 180, icon: <Home color="warning" /> },
  housing: { amount: 1000, icon: <Apartment color="info" /> }, // 🏠 Added Housing Icon
  fitness: { amount: 75, icon: <FitnessCenter color="success" /> }, // 💪 Added Fitness Icon
};

interface BudgetProps {
  totalExpenses: { [key: string]: number };
  categoryBudgets: { [key: string]: number };
  setCategoryBudgets: any;
}

export default function Budget({
  totalExpenses,
  categoryBudgets,
  setCategoryBudgets,
}: BudgetProps) {
  const updateCategoryBudget = (category: string, value: number) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: value });
  };

  useEffect(() => {
    setCategoryBudgets((prevBudgets: any) => {
      const updatedBudgets: { [key: string]: number } = {};
      for (const category in DEFAULT_BUDGETS) {
        updatedBudgets[category] =
          prevBudgets?.[category] ?? DEFAULT_BUDGETS[category].amount;
      }
      return updatedBudgets;
    });
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Category-Specific Budgeting
      </Typography>

      {Object.keys(totalExpenses).length === 0 ? (
        <Typography>No expenses recorded yet.</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          gap={2}
        >
          {Object.keys(totalExpenses).map((category) => {
            const spent = totalExpenses[category] || 0;
            const budget = categoryBudgets[category] || 0;
            const remaining = budget - spent;
            const percentageSpent = Math.min(
              100,
              (spent / (budget || 1)) * 100
            );

            return (
              <Card key={category} sx={{ p: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    {DEFAULT_BUDGETS[category]?.icon}
                    <Typography variant="h6">{category}</Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="Budget"
                    type="number"
                    value={budget}
                    onChange={(e) =>
                      updateCategoryBudget(
                        category,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    sx={{ mt: 1, mb: 2 }}
                  />

                  <Typography variant="body2">
                    Spent: ${spent.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={remaining < 0 ? "error" : "textPrimary"}
                  >
                    Remaining: ${remaining.toFixed(2)}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentageSpent}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: "#ddd",
                        "& .MuiLinearProgress-bar": {
                          bgcolor:
                            remaining < 0 ? "error.main" : "primary.main",
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
