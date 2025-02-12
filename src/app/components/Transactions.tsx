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
  Fade,
  Icon,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  DirectionsBus,
  Fastfood,
  FitnessCenter,
  Home,
  Movie,
  Payment,
  ShoppingBag,
} from "@mui/icons-material";

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
  "Utilities",
  "Fitness",
  "Housing",

  "Rent",
];

// 🔹 Mapping of categories to icons
const CATEGORY_ICONS: { [key: string]: React.ElementType } = {
  Food: Fastfood,
  Transport: DirectionsBus,
  Entertainment: Movie,
  Shopping: ShoppingBag,
  Utilities: Home,
  Fitness: FitnessCenter,
  Rent: Payment,
};

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

  const [openSnackbar, setOpenSnackbar] = useState(false);
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
    setOpenSnackbar(true);
  };
  const isFormValid =
    form.name.trim() !== "" &&
    form.amount !== "" &&
    !isNaN(parseFloat(form.amount)) &&
    form.category.trim() !== "" &&
    form.date.trim() !== "";

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography fontSize={32} variant="h2" gutterBottom>
        Transactions
      </Typography>

      {/* 🔹 Transaction Form */}
      <Box component="form" onSubmit={handleAddTransaction} sx={{ mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            sx={{ background: "#fff" }}
            fullWidth
            label="Transaction Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            sx={{ background: "#fff" }}
            fullWidth
            label="Amount (use negative for expenses)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          {/* 🔹 Dropdown for Categories */}
          <FormControl fullWidth required sx={{ background: "#fff" }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              onKeyDown={(e) => {
                e;
              }}
              label="Category"
              labelId="category-label"
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
            sx={{ background: "#fff" }}
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Button disabled={!isFormValid} variant="contained" type="submit">
            Add Transaction
          </Button>
        </Box>
      </Box>

      {/* 🔹 Transaction List */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">Recent Transactions</Typography>
        <List>
          {sortedTransactions.map((tx, index) => {
            const IconComponent = CATEGORY_ICONS[tx.category] || Payment; // Default icon
            return (
              <Fade
                in={true}
                timeout={tx.id === sortedTransactions[0].id ? 500 : 0}
                key={tx.id}
              >
                <ListItem>
                  {/* 🔹 Render the Icon Based on Category */}
                  <IconComponent
                    sx={{ marginRight: 2, color: "primary.main" }}
                  />

                  <ListItemText
                    sx={{ display: "flex", justifyContent: "space-between" }}
                    primary={`${tx.name} `}
                    secondary={`${tx.amount > 0 ? "+" : "-"} $${Math.abs(
                      tx.amount
                    ).toFixed()}`}
                  />
                </ListItem>
              </Fade>
            );
          })}
        </List>
      </Paper>
      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Transaction added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
