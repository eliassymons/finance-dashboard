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
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  DirectionsBus,
  Fastfood,
  FitnessCenter,
  Home,
  Movie,
  Payment,
  AttachMoney,
  Delete,
} from "@mui/icons-material";
import { useFinance } from "../context/FinanceContext";

import Loading from "./Loading";
import EmptyDisplay from "./Empty";
import { Transaction } from "../types/transaction";

// Expense Categories
const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Fitness",
  "Rent",
];

// Category Icons
const CATEGORY_ICONS: { [key: string]: React.ElementType } = {
  Food: Fastfood,
  Transportation: DirectionsBus,
  Entertainment: Movie,
  Utilities: Home,
  Fitness: FitnessCenter,
  Rent: Payment,
  Income: AttachMoney, // Default icon for income transactions
};
const categoryFormTooltip = "Only expenses are categorized.";

export default function Transactions() {
  const {
    transactions,
    addTransaction,
    isLoading,
    isFetching,
    deleteTransaction,
  } = useFinance();
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "Expense",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dateError, setDateError] = useState(""); // State for validation error

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0]; // Get today's date

    if (selectedDate > today) {
      setDateError("Date cannot be in the future.");
    } else if (selectedDate < "2023-01-01") {
      setDateError("Date must be after January 1, 2023.");
    } else {
      setDateError(""); // Clear error if valid
    }

    setForm({ ...form, date: selectedDate });
  };

  // Handle Loading/Error States
  if (isLoading || isFetching) {
    return <Loading name={"Transactions"} />;
  }

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
      amount: form.type === "Expense" ? -parsedAmount : parsedAmount,
      category: form.type === "Expense" ? form.category.trim() : undefined,
      date: form.date,
      type: form.type,
    };

    addTransaction(newTransaction as Transaction); //  Call `addTransaction` mutation
    setForm({ name: "", amount: "", category: "", date: "", type: "Expense" });
    setOpenSnackbar(true);
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.amount !== "" &&
    !isNaN(parseFloat(form.amount)) &&
    (form.type === "Income" || form.category.trim() !== "") &&
    form.date.trim() !== "";

  return (
    <>
      <Typography
        textAlign="center"
        mt={4}
        fontSize={32}
        variant="h2"
        gutterBottom
      >
        Transactions
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        gap={4}
        p={2}
        flexWrap="wrap-reverse"
      >
        {/*  Transaction List */}
        <Paper sx={{ p: 2, flex: 1, maxWidth: 400, minWidth: 340 }}>
          <Typography variant="h6">Recent Transactions</Typography>
          <List>
            {sortedTransactions.length === 0 ? (
              <EmptyDisplay type="transaction"></EmptyDisplay>
            ) : (
              sortedTransactions.slice(0, 10).map((tx) => {
                const IconComponent =
                  CATEGORY_ICONS[tx.category || "Income"] || Payment;
                return (
                  <Fade in={true} timeout={500} key={tx.id}>
                    <ListItem>
                      <IconComponent
                        sx={{ marginRight: 2, color: "primary.main" }}
                      />
                      <ListItemText
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        primary={tx.name}
                        secondary={
                          <Typography
                            marginRight={2}
                            sx={{
                              color: tx.type === "Income" ? "green" : "red",
                            }}
                          >
                            {tx.type === "Income" ? "+" : "-"} $
                            {Math.abs(tx.amount).toFixed(2)}
                          </Typography>
                        }
                      />
                      <IconButton onClick={() => deleteTransaction(tx.id)}>
                        <Delete></Delete>
                      </IconButton>
                    </ListItem>
                  </Fade>
                );
              })
            )}
          </List>
        </Paper>

        {/* Transaction Form */}
        <Box
          flex={1}
          maxWidth={400}
          minWidth={340}
          component="form"
          onSubmit={handleAddTransaction}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              sx={{ background: "#fff" }}
              fullWidth
              label="Transaction Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Box display="flex" gap={2}>
              <TextField
                sx={{ background: "#fff" }}
                fullWidth
                label="Amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              {/* Income/Expense Toggle */}
              <ToggleButtonGroup
                value={form.type}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue)
                    setForm({ ...form, type: newValue, category: "" });
                }}
                aria-label="Transaction Type"
                sx={{ background: "#fff", width: "min-content" }}
              >
                <ToggleButton value="Income">
                  <AttachMoney sx={{ mr: 1 }} />
                  Income
                </ToggleButton>
                <ToggleButton value="Expense">
                  <Payment sx={{ mr: 1 }} />
                  Expense
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/*  Show Category Dropdown ONLY for Expenses */}
            <Tooltip
              disableHoverListener={form.type === "Expense"}
              disableFocusListener={form.type === "Expense"}
              disableTouchListener={form.type === "Expense"}
              arrow
              title={categoryFormTooltip}
              placement="bottom"
            >
              <FormControl
                disabled={form.type === "Income"}
                fullWidth
                sx={{ background: "#fff" }}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  label="Category"
                  labelId="category-label"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {EXPENSE_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>

            <TextField
              sx={{ background: "#fff" }}
              fullWidth
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              slotProps={{
                htmlInput: {
                  max: new Date().toISOString().split("T")[0],
                  min: "2023-01-01",
                },
              }}
              value={form.date}
              onChange={handleDateChange}
              error={!!dateError}
              helperText={dateError}
              required
            />

            <Button disabled={!isFormValid} variant="contained" type="submit">
              Add Transaction
            </Button>
          </Box>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            Transaction added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
