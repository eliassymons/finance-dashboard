"use client";
import Budget from "../components/Budget";
import { useFinance } from "../context/FinanceContext";

function BudgetPage() {
  const { categoryTotals } = useFinance();
  return <Budget />;
}

export default BudgetPage;
