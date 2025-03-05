"use client";

import { useParams } from "next/navigation";
import { useFinance } from "../../context/FinanceContext";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { Transaction } from "@/app/types/transaction";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

export default function BudgetCategoryPage() {
  const params = useParams();

  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category || "";

  const { transactions, categoryBudgets, updateBudget, isLoading, isFetching } =
    useFinance();

  // Find budget entry
  const budgetEntry = categoryBudgets.find(
    (b) => b.category.toLowerCase() === category
  );

  //  Prevent conditional destructuring
  const budgetId = budgetEntry?.id ?? "";
  const budgetedAmount = budgetEntry?.budgetedAmount ?? 0;
  const spentAmount = budgetEntry?.spentAmount ?? 0;

  //  Always initialize state
  const [newBudget, setNewBudget] = useState<number>(budgetedAmount);

  //  Always call hooks at the top level
  const updateBudgetMutation = useMutation({
    mutationFn: async (newBudgetAmount: number) => {
      if (!budgetEntry) throw new Error("Budget entry not found.");
      return updateBudget(Number(budgetId), newBudgetAmount);
    },
  });

  //  Check loading before rendering content
  if (isLoading || isFetching) {
    return <Loading name={category} />;
  }

  //  Handle missing budgetEntry safely
  if (!budgetEntry) {
    return <Typography>No budget found for {category}</Typography>;
  }

  const budgetUsagePercentage =
    budgetedAmount > 0
      ? Math.min((spentAmount / budgetedAmount) * 100, 100)
      : 0;

  const relevantTx: Transaction[] = transactions.filter(
    (t) => t.category && t.category.toLowerCase() === category
  );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Link href={"/budget"}>
        <IconButton sx={{ position: "absolute" }}>
          <ArrowBack fontSize="large" />
        </IconButton>
      </Link>
      <Typography fontSize={32} variant="h2" gutterBottom textAlign="center">
        {category.charAt(0).toUpperCase() + category.slice(1)} Spending
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Budget Insights */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{ p: 2, flex: 1, minWidth: "200px", textAlign: "center" }}
        >
          <Typography variant="h6">Budgeted</Typography>
          <Typography fontSize={30} fontWeight={600} color="primary">
            ${budgetedAmount.toFixed(2)}
          </Typography>
        </Paper>

        <Paper
          sx={{ p: 2, flex: 1, minWidth: "200px", textAlign: "center" }}
          variant="outlined"
        >
          <Typography variant="h6">Total Spent</Typography>
          <Typography fontSize={30} fontWeight={600} color="error">
            ${spentAmount.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {/* Budget Progress */}
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Budget Used
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={budgetUsagePercentage}
            size={140}
            thickness={8}
            sx={{
              color: spentAmount > budgetedAmount ? "#D32F2F" : "#4CAF50",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" component="div" color="primary">
              {budgetUsagePercentage.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Adjust Budget Section */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }} variant="outlined">
        <Typography fontSize={24} variant="h3" gutterBottom>
          Adjust Budget
        </Typography>
        <TextField
          fullWidth
          label="New Budget"
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(Number(e.target.value))}
          sx={{ mt: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => updateBudgetMutation.mutate(newBudget)}
          disabled={updateBudgetMutation.isPending}
        >
          {updateBudgetMutation.isPending ? "Updating..." : "Update Budget"}
        </Button>
      </Paper>

      {/* Recent Transactions Table */}
      <Paper elevation={0} sx={{ p: 2 }} variant="outlined">
        <Typography fontSize={24} variant="h3" gutterBottom>
          Recent Transactions
        </Typography>
        {relevantTx.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Amount</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relevantTx.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.name}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: tx.amount > 0 ? "success.main" : "error.main",
                    }}
                  >
                    {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(tx.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No transactions recorded yet.</Typography>
        )}
      </Paper>
    </Box>
  );
}
