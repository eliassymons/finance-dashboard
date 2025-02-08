"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Transaction } from "../types/transaction";
import { initialTransactions } from "../test-data/init-tx";

// Define types for the context state
interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  categoryBudgets: { [key: string]: number };
  setCategoryBudgets: (budgets: { [key: string]: number }) => void;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  categoryTotals: { [key: string]: number };
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("transactions") || "[]");
    } catch {
      return [];
    }
  });

  const [categoryBudgets, setCategoryBudgets] = useState<{
    [key: string]: number;
  }>(() => {
    return JSON.parse(localStorage.getItem("categoryBudgets") || "{}") || {};
  });

  useEffect(() => {
    const storedTransactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    if (storedTransactions.length === 0) {
      localStorage.setItem("transactions", JSON.stringify(initialTransactions));
      setTransactions(initialTransactions);
    } else {
      setTransactions(storedTransactions);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("categoryBudgets", JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const totalIncome =
    transactions
      .filter((tx) => tx.amount > 0)
      .reduce((acc, tx) => acc + tx.amount, 0) || 0;
  const totalExpenses =
    transactions
      .filter((tx) => tx.amount < 0)
      .reduce((acc, tx) => acc + tx.amount, 0) || 0;
  const totalBalance = totalIncome + totalExpenses;

  const categoryTotals = transactions.reduce((acc, tx) => {
    if (tx.amount < 0) {
      const cleanCategory = tx.category.trim().toLowerCase();
      acc[cleanCategory] = (acc[cleanCategory] || 0) + Math.abs(tx.amount);
    }
    return acc;
  }, {} as { [key: string]: number });

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
