"use client";

import Transactions from "../components/Transactions";
import { useFinance } from "../context/FinanceContext";

function TransactionPage() {
  const { transactions, addTransaction } = useFinance();
  return <Transactions />;
}

export default TransactionPage;
