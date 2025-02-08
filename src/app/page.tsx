"use client";
import { useState } from "react";
import { useFinance } from "./context/FinanceContext";
import styles from "./styles/Home.module.scss";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import Budget from "./components/Budget";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Home() {
  const {
    transactions,
    addTransaction,
    categoryBudgets,
    setCategoryBudgets,
    totalIncome,
    totalExpenses,
    totalBalance,
    categoryTotals,
  } = useFinance();

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
  });

  const [activeTab, setActiveTab] = useState("dashboard");

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

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1>Personal Finance Dashboard</h1>

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("transactions")}>
          Transactions
        </button>
        <button onClick={() => setActiveTab("budget")}>Budget</button>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className={styles.summaryCards}>
            <div className={styles.card}>
              <h2>Total Balance</h2>
              <p>${totalBalance.toFixed(2)}</p>
            </div>
            <div className={styles.card}>
              <h2>Total Income</h2>
              <p>${totalIncome.toFixed(2)}</p>
            </div>
            <div className={styles.card}>
              <h2>Total Expenses</h2>
              <p>${Math.abs(totalExpenses).toFixed(2)}</p>
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartContainer}>
              <h2>Expense Breakdown</h2>
              <Doughnut data={chartData} />
            </div>
            <div className={styles.chartContainer}>
              <h2>Expense Breakdown</h2>
              <Bar data={chartData} />
            </div>
          </div>
        </>
      )}

      {activeTab === "transactions" && (
        <>
          <form onSubmit={handleAddTransaction} className={styles.form}>
            <input
              type="text"
              placeholder="Transaction Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount (use negative for expenses)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <button type="submit">Add Transaction</button>
          </form>
        </>
      )}

      {activeTab === "budget" && (
        <Budget
          categoryBudgets={categoryBudgets}
          setCategoryBudgets={setCategoryBudgets}
          totalExpenses={categoryTotals}
        />
      )}
    </div>
  );
}
