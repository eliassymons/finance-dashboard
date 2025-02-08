"use client";

import { useState } from "react";
import styles from "../styles/Budget.module.scss";

interface BudgetProps {
  totalExpenses: { [key: string]: number };
  categoryBudgets: { [key: string]: number };
  setCategoryBudgets: (value: { [key: string]: number }) => void;
}

export default function Budget({
  totalExpenses,
  categoryBudgets,
  setCategoryBudgets,
}: BudgetProps) {
  const updateCategoryBudget = (category: string, value: number) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: value });
  };

  return (
    <div className={styles.budgetContainer}>
      <h2>Category-Specific Budgeting</h2>
      {Object.keys(totalExpenses).length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        Object.keys(totalExpenses).map((category) => {
          const spent = totalExpenses[category] || 0;
          const budget = categoryBudgets[category] || 0;
          const remaining = budget - spent;
          return (
            <div key={category} className={styles.budgetItem}>
              <h3>{category}</h3>
              <label>Budget:</label>
              <input
                type="number"
                value={budget}
                onChange={(e) =>
                  updateCategoryBudget(
                    category,
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <p>Spent: ${spent.toFixed(2)}</p>
              <p>Remaining: ${remaining.toFixed(2)}</p>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${Math.max(0, (spent / (budget || 1)) * 100)}%`,
                    backgroundColor: spent > budget ? "red" : "#36a2eb",
                  }}
                ></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
