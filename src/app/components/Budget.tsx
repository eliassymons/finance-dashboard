"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  DirectionsBus,
  Fastfood,
  Home,
  Movie,
  ShoppingBag,
  FitnessCenter,
  Apartment,
  Edit,
} from "@mui/icons-material";
import { useFinance } from "../context/FinanceContext";
import Loading from "./Loading";

// Default icons for categories
const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  food: <Fastfood color="warning" />,
  transportation: <DirectionsBus color="secondary" />,
  entertainment: <Movie color="primary" />,
  shopping: <ShoppingBag color="error" />,
  utilities: <Home color="action" />,
  housing: <Apartment color="info" />,
  fitness: <FitnessCenter color="success" />,
};

interface BudgetProps {
  totalExpenses: { [key: string]: number }; // Expenses per category
}

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function Budget({ totalExpenses }: BudgetProps) {
  const { categoryBudgets, isLoading, isFetching } = useFinance(); // ✅ Get budgets from FinanceContext

  if (isLoading || isFetching) {
    return <Loading name="Budgets" />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography textAlign="center" fontSize={32} variant="h2" gutterBottom>
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
            const budget =
              categoryBudgets.find((c) => c.category === category)
                ?.budgetedAmount ?? 0; // ✅ Use global `categoryBudgets`
            const remaining = budget - spent;
            const percentageSpent = Math.min(
              (spent / (budget || 1)) * 100,
              100
            );
            const tooltipText = `Click for a more in-depth look at your ${category} spending.`;

            return (
              <Card key={category} sx={{ px: 2 }} variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    {CATEGORY_ICONS[category] || <Home />} {/* Default icon */}
                    <Typography variant="h6">{capitalize(category)}</Typography>
                    <Link
                      key={category}
                      href={`/budget/${category}`}
                      passHref
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        marginLeft: "auto",
                      }}
                    >
                      <Tooltip title={tooltipText} arrow placement="right">
                        <IconButton>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </Box>

                  <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                    ${budget.toLocaleString()}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Spent:</strong> ${spent.toFixed()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={remaining < 0 ? "error" : "textPrimary"}
                  >
                    <strong>
                      {remaining >= 0 ? "Remaining:" : "Over budget by:"}
                    </strong>{" "}
                    ${Math.abs(remaining).toFixed()}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentageSpent}
                      sx={{
                        height: 12,
                        borderRadius: 5,
                        bgcolor: "#ddd",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: remaining < 0 ? "#FF6961" : "#70b04d",
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
