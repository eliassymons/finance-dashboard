"use client";

import Transactions from "../components/Transactions";
import { useFinance } from "../context/FinanceContext";

function TransactionPage() {
  const { transactions, addTransaction } = useFinance();
  return (
    <Transactions transactions={transactions} addTransaction={addTransaction} />
  );
}

export default TransactionPage;
