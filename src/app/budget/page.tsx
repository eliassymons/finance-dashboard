"use client";
import Budget from "../components/Budget";
import { useFinance } from "../context/FinanceContext";

function BudgetPage() {
  const { categoryBudgets, setCategoryBudgets, categoryTotals } = useFinance();
  return (
    <Budget
      totalExpenses={categoryTotals}
      categoryBudgets={categoryBudgets}
      setCategoryBudgets={setCategoryBudgets}
    />
  );
}

export default BudgetPage;
