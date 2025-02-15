"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetEntry, Transaction } from "../types/transaction";
import { useFetchData } from "../hooks/useFetchData";

const API_TRANSACTIONS = process.env.NEXT_PUBLIC_API_TRANSACTIONS as string;
const API_BUDGETS = process.env.NEXT_PUBLIC_API_BUDGETS as string;

// Define types for the context state
interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  categoryBudgets: BudgetEntry[];
  setCategoryBudgets: React.Dispatch<React.SetStateAction<BudgetEntry[]>>;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  categoryTotals: { [key: string]: number };
  isLoading: boolean; // ✅ New: Loading state
  isFetching: boolean;
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [categoryBudgets, setCategoryBudgets] = useState<BudgetEntry[]>([]);

  // ✅ Fetch transactions using useFetchData
  const {
    data: transactions = [],
    error: transactionsError,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching, // ✅ Capture loading state
  } = useFetchData(API_TRANSACTIONS);

  // ✅ Fetch budgets using useFetchData
  const {
    data: budgets = [],
    error: budgetsError,
    isLoading: isBudgetsLoading,
    isFetching: isBudgetsFetching, // ✅ Capture loading state
  } = useFetchData(API_BUDGETS);

  // ✅ Transform budgets into an object (e.g., { food: 200, rent: 1000 })
  useEffect(() => {
    if (budgets.length > 0) {
      setCategoryBudgets(budgets); // ✅ Store full budget objects, not just numbers
    }
  });

  // ✅ Mutation for adding a new transaction
  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id">) => {
      const response = await fetch(API_TRANSACTIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_TRANSACTIONS] });
    },
  });

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    addTransactionMutation.mutate(transaction);
  };

  const totalIncome =
    transactions
      .filter((tx: Transaction) => tx.type === "Income")
      .reduce((acc: number, tx: Transaction) => acc + tx.amount, 0) || 0;

  const totalExpenses =
    transactions
      .filter((tx: Transaction) => tx.type === "Expense")
      .reduce((acc: number, tx: Transaction) => acc + tx.amount, 0) || 0;

  const totalBalance = totalIncome - totalExpenses;

  const categoryTotals = transactions.reduce(
    (acc: { [key: string]: number }, tx: Transaction) => {
      if (tx.type === "Expense") {
        const cleanCategory = tx.category.trim()?.toLowerCase();
        acc[cleanCategory] = (acc[cleanCategory] || 0) + Math.abs(tx.amount);
      }
      return acc;
    },
    {} as { [key: string]: number }
  );

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        categoryBudgets,
        setCategoryBudgets,
        totalIncome,
        totalExpenses,
        totalBalance,
        categoryTotals,
        isLoading: isTransactionsLoading || isBudgetsLoading,
        // ✅ Expose loading state
        isFetching: isTransactionsFetching || isBudgetsFetching,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook for using the finance context
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
