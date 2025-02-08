"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

interface TransactionsProps {
  transactions: {
    id: number;
    name: string;
    amount: number;
    category: string;
    date: string;
  }[];
  addTransaction: (transaction: {
    id: number;
    name: string;
    amount: number;
    category: string;
    date: string;
  }) => void;
}

// 🔹 Predefined Category Options
const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Groceries",
  "Health",
  "Utilities",
  "Shopping",
  "Rent",
  "Other",
];

export default function Transactions({
  transactions,
  addTransaction,
}: TransactionsProps) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
  });
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(form.amount);
    if (isNaN(parsedAmount)) {
      alert("Please enter a valid number for the amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: form.name.trim(),
      amount: parsedAmount,
      category: form.category.trim(),
      date: form.date,
    };

    addTransaction(newTransaction);
    setForm({ name: "", amount: "", category: "", date: "" });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      {/* 🔹 Transaction Form */}
      <Box component="form" onSubmit={handleAddTransaction} sx={{ mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Transaction Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Amount (use negative for expenses)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          {/* 🔹 Dropdown for Categories */}
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Button variant="contained" type="submit">
            Add Transaction
          </Button>
        </Box>
      </Box>

      {/* 🔹 Transaction List */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">Recent Transactions</Typography>
        <List>
          {sortedTransactions.map((tx, index) => (
            <ListItem key={`${tx.id}-${index}`}>
              <ListItemText
                primary={`${tx.name} - $${tx.amount.toFixed(2)} (${
                  tx.category
                })`}
                secondary={`Date: ${tx.date}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
