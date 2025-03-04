"use client";

import { createContext, useContext, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BudgetEntry, Transaction } from "../types/transaction";

const API_TRANSACTIONS = process.env.NEXT_PUBLIC_API_TRANSACTIONS as string;
const API_BUDGETS = process.env.NEXT_PUBLIC_API_BUDGETS as string;
const API_COST_OF_LIVING = process.env.NEXT_PUBLIC_API_COST_OF_LIVING as string;
const API_COST_OF_LIVING_STATES = process.env
  .NEXT_PUBLIC_API_COST_OF_LIVING_STATES as string;

// Define types for the context state
interface FinanceContextType {
  transactions: Transaction[];
  categoryBudgets: BudgetEntry[];
  updateBudget: (budgetId: number, newBudgetAmount: number) => void;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  categoryTotals: { [key: string]: number };
  costOfLivingData: { year: number; index: number }[];
  costOfLivingByState: any;
  isLoading: boolean;
  isFetching: boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: number | string) => void;
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // ✅ Fetch Transactions
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = useQuery({
    queryKey: [API_TRANSACTIONS],
    queryFn: () => fetch(API_TRANSACTIONS).then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Fetch Cost of Living Data (by State)
  const {
    data: costOfLivingByState = [],
    isLoading: isCostOfLivingStatesLoading,
  } = useQuery({
    queryKey: [API_COST_OF_LIVING_STATES],
    queryFn: () => fetch(API_COST_OF_LIVING_STATES).then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Fetch Budgets
  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    isFetching: isBudgetsFetching,
  } = useQuery({
    queryKey: [API_BUDGETS],
    queryFn: () => fetch(API_BUDGETS).then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Fetch Cost of Living Data
  const { data: costOfLivingData = [], isLoading: isCostOfLivingLoading } =
    useQuery({
      queryKey: [API_COST_OF_LIVING],
      queryFn: () => fetch(API_COST_OF_LIVING).then((res) => res.json()),
      staleTime: 5 * 60 * 1000,
    });

  // ✅ Compute category totals (to track how much was spent per category)
  const categoryTotals = transactions.reduce(
    (acc: { [key: string]: number }, tx: Transaction) => {
      if (tx.type === "Expense") {
        const category = tx.category.trim().toLowerCase();
        acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
      }
      return acc;
    },
    {}
  );

  // ✅ Compute categoryBudgets
  const categoryBudgets = budgets.map((budget: BudgetEntry) => ({
    ...budget,
    spentAmount: categoryTotals[budget.category.toLowerCase()] || 0, // ✅ Ensure spentAmount is accurate
  }));

  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id">) => {
      const response = await fetch(API_TRANSACTIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) throw new Error("Failed to add transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_TRANSACTIONS] }); // ✅ Trigger refetch
    },
  });

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    addTransactionMutation.mutate(transaction);
  };

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: number | string) => {
      const deleteUrl = `${API_TRANSACTIONS}/${transactionId}`;
      const response = await fetch(deleteUrl, { method: "DELETE" });

      if (!response.ok) throw new Error(`Failed to delete transaction`);
      return transactionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_TRANSACTIONS] }); // ✅ Trigger refetch
    },
  });

  const deleteTransaction = (transactionId: number | string) => {
    deleteTransactionMutation.mutate(transactionId);
  };

  const updateBudgetMutation = useMutation({
    mutationFn: async ({
      budgetId,
      newBudgetAmount,
    }: {
      budgetId: number;
      newBudgetAmount: number;
    }) => {
      const response = await fetch(`${API_BUDGETS}/${budgetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetedAmount: newBudgetAmount }),
      });

      if (!response.ok) throw new Error("Failed to update budget");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BUDGETS] }); // ✅ Refetch budgets
    },
  });

  const updateBudget = (budgetId: number, newBudgetAmount: number) => {
    updateBudgetMutation.mutate({ budgetId, newBudgetAmount });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        categoryBudgets,
        updateBudget,
        totalIncome: (transactions as Transaction[])
          .filter((tx) => tx.type === "Income")
          .reduce((acc, tx) => acc + tx.amount, 0),
        totalExpenses:
          (transactions as Transaction[])
            .filter((tx) => tx.type === "Expense")
            .reduce((acc, tx) => acc + Math.abs(tx.amount), 0) * -1,

        totalBalance:
          (transactions as Transaction[])
            .filter((tx) => tx.type === "Income")
            .reduce((acc, tx) => acc + tx.amount, 0) +
          (transactions as Transaction[])
            .filter((tx) => tx.type === "Expense")
            .reduce((acc, tx) => acc - Math.abs(tx.amount), 0), // ✅ Add negative expenses

        categoryTotals,
        costOfLivingData,
        costOfLivingByState,
        isLoading:
          isTransactionsLoading || isBudgetsLoading || isCostOfLivingLoading,
        isFetching:
          isTransactionsFetching ||
          isBudgetsFetching ||
          isCostOfLivingStatesLoading,
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
