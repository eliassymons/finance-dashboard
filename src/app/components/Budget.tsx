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

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function Budget() {
  const { categoryBudgets, isLoading, isFetching } = useFinance(); //  Get budgets from FinanceContext

  if (isLoading || isFetching) {
    return <Loading name="Budgets" />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography
        mb={4}
        textAlign="center"
        fontSize={32}
        variant="h2"
        gutterBottom
      >
        Category-Specific Budgeting
      </Typography>

      {categoryBudgets.length === 0 ? (
        <Typography>No expenses recorded yet.</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          gap={2}
        >
          {categoryBudgets.map((category) => {
            const spent = category.spentAmount ?? 0;
            const budget = category.budgetedAmount ?? 0;
            const remaining = budget - spent;
            const percentageSpent = Math.min(
              (spent / (budget || 1)) * 100,
              100
            );
            const tooltipText = `Click to view your ${category.category} spending and make budgeting adjustments.`;

            return (
              <Card key={category.id} sx={{ px: 2 }} variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    {CATEGORY_ICONS[category.category] || <Home />}{" "}
                    {/* Default icon */}
                    <Typography variant="h6">
                      {capitalize(category.category)}
                    </Typography>
                    <Link
                      key={category.id}
                      href={`/budget/${category.category}`}
                      passHref
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        marginLeft: "auto",
                      }}
                    >
                      <Tooltip
                        title={<p style={{ fontSize: 14 }}>{tooltipText}</p>}
                        arrow
                        placement="right"
                      >
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
